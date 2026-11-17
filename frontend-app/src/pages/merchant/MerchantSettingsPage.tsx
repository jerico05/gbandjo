import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Icon, type IconName } from '../../components/icons/Icon'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { getApiErrorMessage } from '../../lib/api/errors'
import type { Store, UserSummary } from '../../lib/api/types'
import { logout } from '../../lib/services/authService'
import { fetchMyStore } from '../../lib/services/storeService'
import { changePassword, fetchProfile, updateProfile } from '../../lib/services/userService'
import { cn } from '../../lib/utils/cn'
import { useAuthStore } from '../../stores/authStore'
import { MerchantStoreSection } from './MerchantStoreSection'

type SettingsTab = 'compte' | 'securite' | 'boutique'

const tabs: Array<{ id: SettingsTab; label: string; description: string; icon: IconName }> = [
  { id: 'compte', label: 'Compte', description: 'Identité et coordonnées', icon: 'user' },
  { id: 'securite', label: 'Sécurité', description: 'Mot de passe et session', icon: 'lock' },
  { id: 'boutique', label: 'Ma boutique', description: 'Fiche commerce', icon: 'store' },
]

function accountStatusLabel(status?: string) {
  if (!status) return '…'
  if (status === 'ACTIF' || status === 'ACTIVE') return 'Compte actif'
  return status.replaceAll('_', ' ')
}

export function MerchantSettingsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('onglet') as SettingsTab | null
  const activeTab: SettingsTab = tabParam && tabs.some((t) => t.id === tabParam) ? tabParam : 'compte'

  const setUser = useAuthStore((s) => s.setUser)
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const clearSession = useAuthStore((s) => s.clearSession)
  const sessionUser = useAuthStore((s) => s.user)

  const [profile, setProfile] = useState<UserSummary | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [passwords, setPasswords] = useState({ old: '', new: '' })

  useEffect(() => {
    void Promise.all([fetchProfile().catch(() => null), fetchMyStore().catch(() => null)])
      .then(([user, shop]) => {
        if (user) setProfile(user)
        if (shop) setStore(shop)
      })
      .finally(() => setLoading(false))
  }, [])

  function selectTab(id: SettingsTab) {
    setMessage('')
    setError('')
    setSearchParams({ onglet: id }, { replace: true })
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault()
    if (!profile) return
    setMessage('')
    setError('')
    try {
      const updated = await updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
      })
      setProfile(updated)
      setUser(updated)
      setMessage('Profil mis à jour.')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await changePassword(passwords.old, passwords.new)
      setPasswords({ old: '', new: '' })
      setMessage('Mot de passe modifié.')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function handleLogout() {
    if (refreshToken) {
      try {
        await logout(refreshToken)
      } catch {
        /* ignore */
      }
    }
    clearSession()
    navigate('/connexion', { replace: true })
  }

  const displayUser = profile ?? sessionUser
  const initials =
    `${displayUser?.first_name?.[0] ?? ''}${displayUser?.last_name?.[0] ?? ''}`.toUpperCase() || 'C'

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-gbandjo-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gbandjo-green text-lg font-bold text-white">
              {initials}
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-gbandjo-ink sm:text-2xl">Paramètres</h1>
              <p className="text-sm text-gbandjo-muted">
                {displayUser
                  ? `${displayUser.first_name} ${displayUser.last_name}, ${displayUser.email}`
                  : 'Gérez votre compte commerçant'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">Commerçant</Badge>
            {displayUser?.account_status ? (
              <Badge tone="neutral">{accountStatusLabel(displayUser.account_status)}</Badge>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_1fr]">
        <nav className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab.id)}
              className={cn(
                'flex min-w-[200px] shrink-0 items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition lg:min-w-0 lg:w-full',
                activeTab === tab.id
                  ? 'border-gbandjo-green/40 bg-white shadow-sm'
                  : 'border-transparent bg-white/60 hover:border-gbandjo-border hover:bg-white',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  activeTab === tab.id ? 'bg-gbandjo-green-light text-gbandjo-green' : 'bg-gbandjo-surface text-gbandjo-muted',
                )}
              >
                <Icon name={tab.icon} className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gbandjo-ink">{tab.label}</span>
                <span className="hidden text-xs text-gbandjo-muted sm:block">{tab.description}</span>
              </span>
            </button>
          ))}
        </nav>

        <section className="min-w-0 rounded-3xl border border-gbandjo-border bg-white p-5 shadow-sm sm:p-8">
          {loading && activeTab !== 'boutique' ? (
            <p className="text-sm text-gbandjo-muted">Chargement…</p>
          ) : null}

          {message ? (
            <p className="mb-4 rounded-xl border border-gbandjo-green/30 bg-gbandjo-green-light/50 px-4 py-2.5 text-sm font-medium text-gbandjo-green-dark">
              {message}
            </p>
          ) : null}
          {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

          {activeTab === 'compte' && profile ? (
            <div>
              <h2 className="text-base font-bold text-gbandjo-ink">Informations personnelles</h2>
              <p className="mt-1 text-sm text-gbandjo-muted">Ces informations sont visibles sur vos échanges avec l&apos;équipe Gbandjo.</p>
              <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={saveProfile}>
                <Input
                  label="Prénom"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                />
                <Input
                  label="Nom"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  className="sm:col-span-2"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
                <Input
                  label="Téléphone"
                  className="sm:col-span-2"
                  value={profile.phone ?? ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <Button type="submit">Enregistrer les modifications</Button>
                </div>
              </form>
            </div>
          ) : null}

          {activeTab === 'compte' && !profile && !loading ? (
            <p className="text-sm text-gbandjo-muted">Impossible de charger le profil.</p>
          ) : null}

          {activeTab === 'securite' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-base font-bold text-gbandjo-ink">Mot de passe</h2>
                <p className="mt-1 text-sm text-gbandjo-muted">Utilisez au moins 8 caractères pour votre nouveau mot de passe.</p>
                <form className="mt-6 grid max-w-md gap-4" onSubmit={savePassword}>
                  <Input
                    label="Mot de passe actuel"
                    type="password"
                    autoComplete="current-password"
                    value={passwords.old}
                    onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                    required
                  />
                  <Input
                    label="Nouveau mot de passe"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    required
                  />
                  <Button type="submit" variant="outline">
                    Mettre à jour le mot de passe
                  </Button>
                </form>
              </div>

              <div className="border-t border-gbandjo-border pt-8">
                <h2 className="text-base font-bold text-gbandjo-ink">Session</h2>
                <p className="mt-1 text-sm text-gbandjo-muted">
                  Déconnectez-vous de cet appareil. Vos données restent enregistrées sur le serveur.
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-4 !text-red-600 hover:!bg-red-50"
                  onClick={() => void handleLogout()}
                >
                  Se déconnecter
                </Button>
              </div>
            </div>
          ) : null}

          {activeTab === 'boutique' ? (
            <div className="-m-5 sm:-m-8">
              <MerchantStoreSection store={store} onUpdated={setStore} variant="dashboard" />
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}