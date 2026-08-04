const dateFmt = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatDate = (iso: string) => dateFmt.format(new Date(iso))

export const formatDateRange = (start: string, end: string) =>
  `${dateFmt.format(new Date(start))} — ${dateFmt.format(new Date(end))}`
