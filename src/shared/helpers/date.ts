export const toValidDate = (value?: Date | string | null): Date | null => {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export const formatDue = (due?: Date | string | null) => {
  const d = toValidDate(due)
  if (!d) return '—'
  return d.toLocaleDateString()
}
