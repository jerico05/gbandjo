import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import heroImage from '../assets/hero.png'
import { LogoGbandjoAdmin } from '../components/branding/LogoGbandjoAdmin'
import { Button } from '../components/ui/Button'
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
    <div className="relative min-h-svh overflow-hidden bg-gbandjo-surface">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-gbandjo-blue/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gbandjo-cyan/10 blur-3xl" />

      <div className="grid min-h-svh lg:grid-cols-2">
        <ImagePanel />
        <div className="flex items-center justify-center px-4 py-10 sm:px-8">
          <section className="w-full max-w-md overflow-hidden rounded-3xl border border-gbandjo-border bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="h-1.5 bg-gradient-to-r from-gbandjo-blue via-gbandjo-cyan to-gbandjo-blue" />
            <div className="px-6 py-8 sm:px-9 sm:py-10">
              <LogoGbandjoAdmin className="mx-auto mb-6 lg:hidden" />
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-gbandjo-blue">
                Espace sécurisé
              </p>
              <h1 className="text-center text-2xl font-extrabold text-gbandjo-ink">Connexion admin</h1>
              <p className="mt-2 text-center text-sm text-gbandjo-muted">
                Accès réservé aux administrateurs de la plateforme.
              </p>

              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gbandjo-ink">
                  Adresse email
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gbandjo-blue focus:ring-2 focus:ring-gbandjo-blue/20"
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
                    className="mt-1.5 w-full rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gbandjo-blue focus:ring-2 focus:ring-gbandjo-blue/20"
                    required
                  />
                </label>
                {error ? (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                    {error}
                  </p>
                ) : null}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Connexion…' : 'Se connecter'}
                </Button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function ImagePanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[#0f172a] lg:flex lg:flex-col lg:justify-between">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-br from-gbandjo-blue/80 via-[#0f172a]/90 to-[#0f172a]" aria-hidden />

      <div className="relative z-10 p-10">
        <div className="inline-block rounded-2xl bg-white px-4 py-3 shadow-lg">
          <LogoGbandjoAdmin variant="sidebar" />
        </div>
      </div>
      <div className="relative z-10 max-w-lg p-10">
        <h2 className="text-3xl font-extrabold leading-tight text-white">Pilotage de Gbandjo</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          Validez les commerces, modérez les offres anti gaspi et suivez l&apos;activité des utilisateurs depuis une
          console unifiée.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-slate-200">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gbandjo-cyan" />
            Validation des fiches commerçants
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gbandjo-cyan" />
            Modération du catalogue public
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gbandjo-cyan" />
            Statistiques et indicateurs clés
          </li>
        </ul>
      </div>
      <p className="relative z-10 p-10 text-xs text-slate-500">© Gbandjo administration</p>
    </div>
  )
}