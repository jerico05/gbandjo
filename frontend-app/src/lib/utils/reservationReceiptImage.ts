import { formatFcfa } from './formatMoney'

export type ReservationReceiptInput = {
  reference: string
  offerLabel: string
  storeName: string
  storeAddress: string
  quantity: number
  unitPrice: string
  status: string
  confirmedAt?: string | null
}

function totalAmount(quantity: number, unitPrice: string) {
  const unit = Number(unitPrice)
  if (!Number.isFinite(unit)) return '—'
  return formatFcfa(unit * quantity)
}

export function downloadReservationReceiptImage(input: ReservationReceiptInput) {
  const width = 400
  const height = 520
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#1a5c38'
  ctx.fillRect(0, 0, width, 88)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px system-ui, sans-serif'
  ctx.fillText('Gbandjo', 24, 40)
  ctx.font = '13px system-ui, sans-serif'
  ctx.fillText('Bon de retrait sécurisé', 24, 64)

  let y = 112
  const label = (text: string) => {
    ctx.fillStyle = '#6b7280'
    ctx.font = '11px system-ui, sans-serif'
    ctx.fillText(text, 24, y)
    y += 18
  }
  const value = (text: string, bold = false) => {
    ctx.fillStyle = '#111827'
    ctx.font = `${bold ? 'bold ' : ''}14px system-ui, sans-serif`
    const lines = wrapText(ctx, text, width - 48)
    for (const line of lines) {
      ctx.fillText(line, 24, y)
      y += 18
    }
    y += 6
  }

  label('Référence')
  value(input.reference, true)

  label('Produit')
  value(input.offerLabel)

  label('Commerce')
  value(input.storeName)
  value(input.storeAddress)

  label('Quantité · Montant estimé')
  value(`${input.quantity} × ${formatFcfa(input.unitPrice)} = ${totalAmount(input.quantity, input.unitPrice)}`)

  if (input.confirmedAt) {
    label('Confirmée le')
    value(new Date(input.confirmedAt).toLocaleString('fr-FR'))
  }

  ctx.strokeStyle = '#e5e7eb'
  ctx.beginPath()
  ctx.moveTo(24, y + 4)
  ctx.lineTo(width - 24, y + 4)
  ctx.stroke()
  y += 24

  ctx.fillStyle = '#374151'
  ctx.font = '12px system-ui, sans-serif'
  const footer =
    'Présentez ce reçu (image ou référence) au commerçant lors du retrait. Paiement sur place uniquement.'
  for (const line of wrapText(ctx, footer, width - 48)) {
    ctx.fillText(line, 24, y)
    y += 16
  }

  const link = document.createElement('a')
  link.download = `retrait-${input.reference}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}