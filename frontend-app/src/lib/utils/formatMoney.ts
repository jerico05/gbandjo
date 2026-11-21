export function formatFcfa(value: string | number, options?: { maximumFractionDigits?: number }) {
  const n = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(n)) return '— FCFA'
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(n)
  return `${formatted} FCFA`
}