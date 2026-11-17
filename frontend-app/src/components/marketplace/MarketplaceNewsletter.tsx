import { type FormEvent, useState } from 'react'

export function MarketplaceNewsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
    setEmail('')
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gbandjo-border bg-[#ebe4d8] px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gbandjo-green-dark">Newsletter</p>
        <h2 className="mt-2 text-xl font-extrabold text-gbandjo-ink sm:text-2xl">Restez informé des meilleures offres</h2>
        <p className="mt-2 text-sm text-gbandjo-muted">
          Recevez les alertes anti gaspi et les nouveautés des commerces près de chez vous.
        </p>
        {sent ? (
          <p className="mt-5 text-sm font-semibold text-gbandjo-green">Merci ! Vous êtes inscrit à la liste d&apos;attente.</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="min-w-0 flex-1 rounded-xl border border-gbandjo-border bg-white px-4 py-3 text-sm outline-none focus:border-gbandjo-green"
            />
            <button
              type="submit"
              className="rounded-xl bg-gbandjo-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-gbandjo-green-dark"
            >
              S&apos;inscrire
            </button>
          </form>
        )}
      </div>
    </section>
  )
}