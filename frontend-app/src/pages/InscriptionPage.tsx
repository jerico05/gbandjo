import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthPageLayout } from '../components/auth/AuthPageLayout'
import { Icon } from '../components/icons/Icon'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { getApiErrorMessage } from '../lib/api/errors'
import { registerConsumer, registerMerchant } from '../lib/services/authService'
import { useAuthStore } from '../stores/authStore'
import { cn } from '../lib/utils/cn'

type AccountType = 'CONSOMMATEUR' | 'COMMERCANT'

const accountOptions: Array<{
  type: AccountType
  title: string
  description: string
  icon: 'bag' | 'store'
}> = [
  {
    type: 'CONSOMMATEUR',
    title: 'Consommateur',
    description: 'Réserver et récupérer les offres anti gaspi',
    icon: 'bag',
  },
  {
    type: 'COMMERCANT',
    title: 'Commerçant',
    description: 'Publier vos invendus et gérer les réservations',
    icon: 'store',
  },
]

export function InscriptionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const [accountType, setAccountType] = useState<AccountType>('CONSOMMATEUR')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const from = (location.state as { from?: string } | null)?.from
  const consumerReturn =
    from && (from.startsWith('/espace') || from.startsWith('/offres')) ? from.replace(/^\/offres/, '/espace') : '/espace'

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      }
      const tokens =
        accountType === 'COMMERCANT' ? await registerMerchant(payload) : await registerConsumer(payload)
      setSession(tokens)
      navigate(accountType === 'COMMERCANT' ? '/mon-commerce' : consumerReturn, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Inscription impossible.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthPageLayout
      badge="Inscription"
      title="Rejoignez Gbandjo"
      subtitle="Choisissez votre profil et créez un compte en moins d’une minute."
      footer={
        <p className="text-center text-sm text-gbandjo-muted">
          Déjà inscrit ?{' '}
          <Link
            to="/connexion"
            state={from ? { from } : undefined}
            className="font-semibold text-gbandjo-green hover:underline"
          >
            Se connecter
          </Link>
        </p>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {accountOptions.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => setAccountType(opt.type)}
            className={cn(
              'flex flex-col items-start rounded-2xl border p-4 text-left transition',
              accountType === opt.type
                ? 'border-gbandjo-green bg-gbandjo-green-light/50 shadow-sm ring-2 ring-gbandjo-green/30'
                : 'border-gbandjo-border bg-gbandjo-surface/50 hover:border-gbandjo-green/40',
            )}
          >
            <span
              className={cn(
                'mb-3 flex h-11 w-11 items-center justify-center rounded-xl',
                accountType === opt.type ? 'bg-gbandjo-green text-white' : 'bg-white text-gbandjo-green',
              )}
            >
              <Icon name={opt.icon} className="h-6 w-6" />
            </span>
            <span className="text-sm font-bold text-gbandjo-ink">{opt.title}</span>
            <span className="mt-1 text-xs leading-snug text-gbandjo-muted">{opt.description}</span>
          </button>
        ))}
      </div>

      {accountType === 'CONSOMMATEUR' ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-gbandjo-border bg-gbandjo-surface px-4 py-3 text-xs text-gbandjo-muted">
          <Icon name="store" className="mt-0.5 h-4 w-4 shrink-0 text-gbandjo-green" />
          Aucun paiement en ligne : vous réglez sur place lors du retrait chez le commerçant.
        </p>
      ) : (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-gbandjo-orange/30 bg-gbandjo-orange/5 px-4 py-3 text-xs text-gbandjo-muted">
          <Icon name="store" className="mt-0.5 h-4 w-4 shrink-0 text-gbandjo-orange" />
          Votre boutique sera validée avant publication des premières offres.
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Prénom"
            name="first_name"
            autoComplete="given-name"
            value={form.first_name}
            onChange={(e) => updateField('first_name', e.target.value)}
            required
          />
          <Input
            label="Nom"
            name="last_name"
            autoComplete="family-name"
            value={form.last_name}
            onChange={(e) => updateField('last_name', e.target.value)}
            required
          />
        </div>
        <Input
          label="Adresse email"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
        />
        <Input
          label="Téléphone (optionnel)"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
        <Input
          label="Mot de passe"
          type="password"
          name="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => updateField('password', e.target.value)}
          minLength={8}
          required
        />
        <p className="text-xs text-gbandjo-muted">Minimum 8 caractères.</p>
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full !rounded-full !py-3" disabled={isLoading}>
          {isLoading ? 'Création du compte…' : "Créer mon compte"}
        </Button>
      </form>
    </AuthPageLayout>
  )
}