import { type FormEvent, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { getApiErrorMessage } from '../lib/api/errors'
import type { UserSummary } from '../lib/api/types'
import { changePassword, fetchProfile, updateProfile } from '../lib/services/userService'
import { useAuthStore } from '../stores/authStore'

export function ProfilPage() {
  const inConsumerShell = useLocation().pathname.startsWith('/espace')
  const setUser = useAuthStore((s) => s.setUser)
  const [profile, setProfile] = useState<UserSummary | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [passwords, setPasswords] = useState({ old: '', new: '' })

  useEffect(() => {
    void fetchProfile()
      .then(setProfile)
      .catch((err) => setError(getApiErrorMessage(err)))
  }, [])

  async function saveProfile(e: FormEvent) {
    e.preventDefault()
    if (!profile) return
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
    try {
      await changePassword(passwords.old, passwords.new)
      setPasswords({ old: '', new: '' })
      setMessage('Mot de passe modifié.')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  if (!profile) {
    return (
      <Container className={inConsumerShell ? 'py-4 text-gbandjo-muted' : 'py-16 text-gbandjo-muted'}>
        Chargement du profil…
      </Container>
    )
  }

  const content = (
    <>
      <h1 className={inConsumerShell ? 'text-xl font-bold text-gbandjo-ink' : 'text-3xl font-extrabold text-gbandjo-ink'}>
        Mon profil
      </h1>
      {message ? <p className="mt-4 text-sm text-gbandjo-green">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      <form className="mt-8 space-y-4 rounded-2xl border border-gbandjo-border bg-white p-6" onSubmit={saveProfile}>
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
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <Input
          label="Téléphone"
          value={profile.phone ?? ''}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />
        <p className="text-xs text-gbandjo-muted">
          Rôle : {profile.role}, statut : {profile.account_status}
        </p>
        <Button type="submit">Enregistrer</Button>
      </form>
      <form className="mt-8 space-y-4 rounded-2xl border border-gbandjo-border bg-white p-6" onSubmit={savePassword}>
        <h2 className="font-bold text-gbandjo-ink">Mot de passe</h2>
        <Input
          label="Mot de passe actuel"
          type="password"
          value={passwords.old}
          onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
        />
        <Input
          label="Nouveau mot de passe"
          type="password"
          value={passwords.new}
          minLength={8}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
        />
        <Button type="submit" variant="outline">
          Changer le mot de passe
        </Button>
      </form>
    </>
  )

  if (inConsumerShell) {
    return <section className="rounded-3xl border border-gbandjo-border bg-white p-5 shadow-sm sm:p-6">{content}</section>
  }

  return (
    <Container className="max-w-xl py-10">
      {content}
    </Container>
  )
}