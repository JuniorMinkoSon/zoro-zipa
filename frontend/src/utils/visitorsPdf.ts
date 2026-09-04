import type { Visitor } from '../api/visitor'

// The house palette, as used across the site (see index.css).
const INK: [number, number, number] = [17, 17, 16]
const GOLD: [number, number, number] = [198, 161, 91]
const IVORY: [number, number, number] = [250, 250, 247]
const ROW_TINT: [number, number, number] = [247, 245, 239]
const TEXT: [number, number, number] = [43, 42, 39]
const MUTED: [number, number, number] = [140, 136, 126]

const dateTimeFmt = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const dayFmt = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const moment = (iso: string | null) => (iso ? dateTimeFmt.format(new Date(iso)) : '—')

const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? 's' : ''}`

/**
 * Builds the visitor list as a PDF and hands it to the browser.
 *
 * Laid out like a gallery document rather than a database dump: dark masthead,
 * gold rule, a serif title, and a quiet table. jsPDF is imported only when the
 * button is clicked — a few hundred kilobytes have no business slowing down the
 * showcase site, which never exports anything.
 */
export async function downloadVisitorsPdf(visitors: Visitor[], filterLabel?: string) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const autoTable = autoTableModule.default

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 44

  const returning = visitors.filter((v) => v.visits > 1).length
  const totalVisits = visitors.reduce((sum, v) => sum + v.visits, 0)

  /** Dark masthead — full width on the first page, a slim band on the next ones. */
  const drawMasthead = (firstPage: boolean) => {
    const height = firstPage ? 104 : 52
    doc.setFillColor(...INK)
    doc.rect(0, 0, pageWidth, height, 'F')

    doc.setTextColor(...IVORY)
    doc.setFont('times', 'bold')
    doc.setFontSize(firstPage ? 26 : 15)
    doc.text('Zoro Zipa', margin, firstPage ? 52 : 33)

    if (!firstPage) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...MUTED)
      doc.text('Liste des visiteurs', pageWidth - margin, 33, { align: 'right' })
      return
    }

    // Gold rule, then the document label under it.
    doc.setFillColor(...GOLD)
    doc.rect(margin, 64, 34, 1.6, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...GOLD)
    doc.setCharSpace(2.4)
    doc.text('LISTE DES VISITEURS', margin, 84)
    doc.setCharSpace(0)

    doc.setFontSize(8.5)
    doc.setTextColor(170, 166, 156)
    doc.text(`Édité le ${dayFmt.format(new Date())}`, pageWidth - margin, 52, { align: 'right' })
    doc.text(
      `${plural(visitors.length, 'visiteur')} · ${plural(totalVisits, 'visite')}`,
      pageWidth - margin,
      68,
      { align: 'right' },
    )
  }

  const drawFooter = () => {
    const y = pageHeight - 34
    doc.setDrawColor(226, 222, 212)
    doc.setLineWidth(0.6)
    doc.line(margin, y - 12, pageWidth - margin, y - 12)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...MUTED)
    doc.text('Zoro Zipa — document interne', margin, y)
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, y, { align: 'right' })
  }

  // Summary line, just under the masthead.
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...TEXT)
  const summary = returning
    ? `${plural(returning, 'visiteur')} ${returning > 1 ? 'sont revenus' : 'est revenu'} au moins une fois.`
    : 'Aucun visiteur n’est encore revenu une seconde fois.'
  doc.text(summary, margin, 134)

  if (filterLabel) {
    doc.setFontSize(8.5)
    doc.setTextColor(...MUTED)
    doc.text(`Filtre appliqué : « ${filterLabel} »`, margin, 150)
  }

  autoTable(doc, {
    startY: filterLabel ? 168 : 154,
    head: [['Visiteur', 'Téléphone', 'Première visite', 'Dernier passage', 'Visites']],
    body: visitors.map((v) => [
      `${v.firstName} ${v.lastName}`,
      v.phone,
      moment(v.createdAt),
      moment(v.lastSeenAt),
      String(v.visits),
    ]),
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 9.5,
      textColor: TEXT,
      cellPadding: { top: 9, bottom: 9, left: 10, right: 10 },
      lineColor: [232, 228, 218],
      lineWidth: { bottom: 0.5 },
    },
    headStyles: {
      font: 'helvetica',
      fontStyle: 'bold',
      fontSize: 8,
      fillColor: INK,
      textColor: IVORY,
      cellPadding: { top: 8, bottom: 8, left: 10, right: 10 },
      lineWidth: 0,
    },
    alternateRowStyles: { fillColor: ROW_TINT },
    // Widths add up to the content width (595 - 2 × 44), so the table lines up
    // with the masthead above it instead of stopping short of the right margin.
    columnStyles: {
      0: { cellWidth: 140, fontStyle: 'bold' },
      1: { cellWidth: 112 },
      2: { cellWidth: 104 },
      3: { cellWidth: 104 },
      4: { cellWidth: 47, halign: 'right' },
    },
    margin: { left: margin, right: margin, top: 74, bottom: 58 },
    didDrawPage: () => {
      drawMasthead(doc.getNumberOfPages() === 1)
      drawFooter()
    },
  })

  doc.save(`visiteurs-zoro-zipa-${new Date().toISOString().slice(0, 10)}.pdf`)
}
