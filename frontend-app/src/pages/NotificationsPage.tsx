import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { MerchantWorkspace } from '../components/merchant/MerchantWorkspace'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Pagination } from '../components/ui/Pagination'
import { getApiErrorMessage } from '../lib/api/errors'
import type { NotificationItem } from '../lib/api/types'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../lib/services/notificationService'

export function NotificationsPage() {
  const location = useLocation()
  const inMerchantShell = location.pathname.startsWith('/mon-commerce')
  const inConsumerShell = location.pathname.startsWith('/espace')
  const [items, setItems] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [hasPrev, setHasPrev] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [error, setError] = useState('')

  async function load(nextPage = page) {
    try {
      const data = await listNotifications(nextPage, unreadOnly)
      setItems(data.notifications)
      setUnread(data.unread_count)
      setPage(data.pagination.page)
      setPages(data.pagination.pages)
      setHasPrev(data.pagination.has_prev)
      setHasNext(data.pagination.has_next)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  useEffect(() => {
    void load(1)
  }, [unreadOnly])

  async function markRead(id: number) {
    await markNotificationRead(id)
    await load(page)
  }

  async function markAll() {
    await markAllNotificationsRead()
    await load(page)
  }

  const inner = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {!inMerchantShell && !inConsumerShell ? <h1 className="text-3xl font-extrabold text-gbandjo-ink">Notifications</h1> : null}
        <div className={`flex flex-wrap gap-2 ${inMerchantShell ? 'ml-auto' : ''}`}>
          <Button
            variant={unreadOnly ? 'primary' : 'outline'}
            type="button"
            onClick={() => setUnreadOnly((v) => !v)}
          >
            Non lues
          </Button>
          {unread > 0 ? (
            <Button variant="outline" type="button" onClick={() => void markAll()}>
              Tout marquer comme lu ({unread})
            </Button>
          ) : null}
        </div>
      </div>
      {error ? <p className={`text-sm text-red-600 ${inMerchantShell ? 'mt-4' : 'mt-4'}`}>{error}</p> : null}
      <ul className={`space-y-3 ${inMerchantShell ? 'mt-6' : 'mt-8'}`}>
        {items.map((n) => (
          <li
            key={n.id}
            className={`rounded-2xl border p-4 ${n.is_read ? 'border-gbandjo-border bg-white' : 'border-gbandjo-green/30 bg-gbandjo-green-light/40'}`}
          >
            <p className="text-sm font-medium text-gbandjo-ink">{n.message}</p>
            <p className="mt-1 text-xs text-gbandjo-muted">{new Date(n.created_at).toLocaleString('fr-FR')}</p>
            {inConsumerShell && n.reservation_id ? (
              <Link
                to={`/espace/reservations/${n.reservation_id}`}
                className="mt-2 inline-block text-xs font-semibold text-gbandjo-green hover:underline"
              >
                Voir la réservation
              </Link>
            ) : null}
            {!n.is_read ? (
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-gbandjo-green hover:underline"
                onClick={() => void markRead(n.id)}
              >
                Marquer comme lu
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <Pagination page={page} pages={pages} hasPrev={hasPrev} hasNext={hasNext} onPageChange={(p) => void load(p)} className="mt-8" />
    </>
  )

  if (inMerchantShell) {
    return <MerchantWorkspace title="Notifications">{inner}</MerchantWorkspace>
  }

  if (inConsumerShell) {
    return (
      <section className="rounded-3xl border border-gbandjo-border bg-white p-5 shadow-sm sm:p-6">
        <h1 className="mb-6 text-xl font-bold text-gbandjo-ink">Notifications</h1>
        {inner}
      </section>
    )
  }

  return <Container className="py-10">{inner}</Container>
}