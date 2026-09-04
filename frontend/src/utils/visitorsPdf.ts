import type { Visitor } from '../api/visitor'

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

/**
 * Builds the visitor list as a PDF and hands it to the browser.
 *
 * jsPDF is pulled in only when the button is clicked: it weighs a few hundred
 * kilobytes and has no business slowing down the showcase site, which never
 * exports anything.
 */
export async function downloadVisitorsPdf(visitors: Visitor[], filterLabel?: string) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const autoTable = autoTableModule.default

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const generatedOn = dayFmt.format(new Date())
  const returning = visitors.filter((v) => v.visits > 1).length

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(20, 20, 20)
  doc.text('Zoro Zipa', 40, 52)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(150, 120, 60)
  doc.text('Liste des visiteurs', 40, 72)

  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text(`Edite le ${generatedOn}`, pageWidth - 40, 52, { align: 'right' })
  doc.text(
    `${visitors.length} visiteur(s) - ${returning} revenu(s) au moins une fois`,
    pageWidth - 40,
    68,
    { align: 'right' },
  )

  if (filterLabel) {
    doc.text(`Filtre applique : ${filterLabel}`, 40, 90)
  }

  autoTable(doc, {
    startY: filterLabel ? 104 : 92,
    head: [['Visiteur', 'Téléphone', 'Première visite', 'Dernier passage', 'Visites']],
    body: visitors.map((v) => [
      `${v.firstName} ${v.lastName}`,
      v.phone,
      moment(v.createdAt),
      moment(v.lastSeenAt),
      String(v.visits),
    ]),
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 6, textColor: [40, 40, 40] },
    headStyles: { fillColor: [26, 26, 26], textColor: [250, 250, 247], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 247, 243] },
    columnStyles: { 4: { halign: 'right' } },
    margin: { left: 40, right: 40 },
    didDrawPage: () => {
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        pageWidth - 40,
        doc.internal.pageSize.getHeight() - 24,
        { align: 'right' },
      )
    },
  })

  doc.save(`visiteurs-zoro-zipa-${new Date().toISOString().slice(0, 10)}.pdf`)
}
