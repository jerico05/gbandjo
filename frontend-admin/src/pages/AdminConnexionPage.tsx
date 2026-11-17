import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { LogoGbandjoAdmin } from '../components/branding/LogoGbandjoAdmin'
import { getApiErrorMessage } from '../lib/api/errors'
import { adminLogin } from '../lib/services/authService'
import { useAuthStore } from '../stores/authStore'

export function AdminConnexionPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const tokens = await adminLogin(email, password)
      if (tokens.user.role !== 'ADMIN') {
        setError('Ce compte n’est pas administrateur.')
        return
      }
      setSession(tokens)
      navigate('/tableau-de-bord', { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Connexion impossible.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-[#1e293b] p-10 text-white lg:flex">
        <div className="inline-block rounded-xl bg-white px-4 py-3">
          <LogoGbandjoAdmin variant="sidebar" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold leading-tight">Pilotage de la plateforme Gbandjo</h2>
          <p className="mt-4 max-w-md text-slate-300">
            Validez les commerces, modérez les offres et suivez l&apos;activité des utilisateurs.
          </p>
        </div>
        <p className="text-sm text-slate-500">© Gbandjo, administration</p>
      </div>

      <div className="flex items-center justify-center bg-gbandjo-surface p-6">
        <div className="w-full max-w-md">
          <LogoGbandjoAdmin className="mb-8 lg:hidden" />
          <h1 className="text-2xl font-extrabold text-gbandjo-ink">Connexion</h1>
          <p className="mt-2 text-sm text-gbandjo-muted">Identifiants réservés aux administrateurs.</p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gbandjo-ink">
              Adresse e-mail
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gbandjo-blue"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gbandjo-ink">
              Mot de passe
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gbandjo-blue"
                required
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gbandjo-blue py-3 text-sm font-semibold text-white transition hover:bg-gbandjo-blue-dark disabled:opacity-50"
            >
              {isLoading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}