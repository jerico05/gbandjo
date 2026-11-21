export function userRoleLabel(role: string) {
  const map: Record<string, string> = {
    CONSOMMATEUR: 'Consommateur',
    COMMERCANT: 'Commerçant',
    ADMIN: 'Administrateur',
  }
  return map[role] ?? role
}

export function accountStatusLabel(status: string) {
  const map: Record<string, string> = {
    ACTIF: 'Actif',
    SUSPENDU: 'Suspendu',
    DESACTIVE: 'Désactivé',
  }
  return map[status] ?? status
}

export function storeValidationLabel(status: string) {
  const map: Record<string, string> = {
    EN_ATTENTE: 'En attente',
    VALIDE: 'Validé',
    REJETE: 'Rejeté',
  }
  return map[status] ?? status
}

export function offerStatusLabel(status: string) {
  const map: Record<string, string> = {
    ACTIVE: 'Active',
    DESACTIVEE: 'Désactivée',
    RETIREE: 'Retirée',
  }
  return map[status] ?? status
}