type BadgeTone = 'green' | 'orange' | 'neutral'

export function storeValidationLabel(status: string) {
  switch (status) {
    case 'VALIDE':
      return 'Commerce validé'
    case 'EN_ATTENTE':
      return 'En attente de validation'
    case 'REJETE':
      return 'Demande refusée'
    default:
      return status
  }
}

export function storeValidationTone(status: string): BadgeTone {
  switch (status) {
    case 'VALIDE':
      return 'green'
    case 'EN_ATTENTE':
      return 'orange'
    default:
      return 'neutral'
  }
}