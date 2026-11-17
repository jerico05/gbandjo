import { Navigate } from 'react-router-dom'

import { ConsumerOffersExplorer } from '../components/marketplace/ConsumerOffersExplorer'
import { Container } from '../components/ui/Container'
import { useAuthStore } from '../stores/authStore'

export function OffresPage() {
  const user = useAuthStore((s) => s.user)

  if (user?.role === 'CONSOMMATEUR') {
    return <Navigate to="/espace" replace />
  }

  return (
    <div className="pb-16 pt-8">
      <Container>
        <section className="mb-8 rounded-3xl border border-gbandjo-border bg-gradient-to-r from-gbandjo-green-light to-white p-6 sm:p-8">
          <h1 className="text-3xl font-extrabold text-gbandjo-ink">Marketplace anti gaspi</h1>
          <p className="mt-2 max-w-2xl text-gbandjo-muted">
            Connectez-vous pour une expérience personnalisée ou parcourez les offres disponibles.
          </p>
        </section>
        <ConsumerOffersExplorer offerBasePath="/offres" />
      </Container>
    </div>
  )
}