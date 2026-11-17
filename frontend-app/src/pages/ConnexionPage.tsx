import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthPageLayout } from '../components/auth/AuthPageLayout'
import { Icon } from '../components/icons/Icon'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { getApiErrorMessage } from '../lib/api/errors'
import { login } from '../lib/services/authService'
import { useAuthStore } from '../stores/authStore'

export function ConnexionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const from = (location.state as { from?: string } | null)?.from
  const returnHint = from && (from.startsWith('/espace') || from.startsWith('/offres')) ? from.replace(/^\/offres/, '/espace') : null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const tokens = await login({ email, password })
      setSession(tokens)
      if (tokens.user.role === 'COMMERCANT') {
        navigate(from?.startsWith('/mon-commerce') ? from : '/mon-commerce', { replace: true })
      } else if (tokens.user.role === 'CONSOMMATEUR') {
        navigate(returnHint ?? '/espace', { replace: true })
      } else {
        setError('Utilisez l’espace admin pour ce type de compte.')
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Identifiants incorrects.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthPageLayout
      badge="Connexion"
      title="Bon retour sur Gbandjo"
      subtitle="Connectez-vous pour réserver une offre, suivre vos retraits et recevoir vos alertes."
      footer={
        <p className="text-center text-sm text-gbandjo-muted">
          Pas encore de compte ?{' '}
          <Link
            to="/inscription"
            state={returnHint ? { from: returnHint } : undefined}
            className="font-semibold text-gbandjo-green hover:underline"
          >
            Créer un compte gratuit
          </Link>
        </p>
      }
    >
      {returnHint ? (
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-gbandjo-green/25 bg-gbandjo-green-light/40 px-4 py-3 text-xs text-gbandjo-ink sm:text-sm">
          <Icon name="sparkle" className="mt-0.5 h-4 w-4 shrink-0 text-gbandjo-green" />
          Après connexion, vous serez redirigé vers votre page en cours.
        </p>
      ) : null}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Adresse email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Mot de passe"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full !rounded-full !py-3" disabled={isLoading}>
          {isLoading ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>
    </AuthPageLayout>
  )
}