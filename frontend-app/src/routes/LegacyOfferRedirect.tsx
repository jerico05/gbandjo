import { Navigate, useParams } from 'react-router-dom'

export function LegacyOfferRedirect() {
  const { id } = useParams()
  if (!id) return <Navigate to="/espace" replace />
  return <Navigate to={`/espace/offres/${id}`} replace />
}