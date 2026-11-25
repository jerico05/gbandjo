import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { LogoGbandjo } from '../branding/LogoGbandjo'
import { Icon } from '../icons/Icon'

type AuthPageLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
  badge?: string
}

const highlights = [
  { icon: 'reservations' as const, label: 'Réservation' },
  { icon: 'store' as const, label: 'Retrait local' },
  { icon: 'sparkle' as const, label: 'Anti gaspi' },
]

export function AuthPageLayout({ title, subtitle, children, footer, badge }: AuthPageLayoutProps) {
  return (
    <div className="relative flex w-full items-center justify-center py-10 sm:py-14 lg:py-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl"
        aria-hidden
      >
        <div className="absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-gbandjo-green/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-gbandjo-orange/10 blur-3xl" />
      </div>

      <div className="w-full max-w-[440px] sm:max-w-[480px]">
        <AuthShell title={title} subtitle={subtitle} badge={badge}>
          {children}
          {footer ? <div className="mt-8 border-t border-gbandjo-border pt-6">{footer}</div> : null}
        </AuthShell>

        <ul className="mt-6 flex items-center justify-center gap-6 sm:gap-8">
          {highlights.map((item) => (
            <li key={item.label} className="flex flex-col items-center gap-1.5 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gbandjo-border bg-white text-gbandjo-green shadow-sm">
                <Icon name={item.icon} className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gbandjo-muted">{item.label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-sm text-gbandjo-muted">
          <Link to="/espace" className="font-semibold text-gbandjo-green hover:underline">
            Parcourir le marketplace sans compte
          </Link>
        </p>
      </div>
    </div>
  )
}

function AuthShell({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string
  subtitle: string
  badge?: string
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-gbandjo-border bg-white shadow-[0_16px_50px_rgba(26,46,31,0.12)]">
      <div className="px-6 py-8 sm:px-9 sm:py-10">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="mb-5 inline-flex" aria-label="Accueil Gbandjo">
            <LogoGbandjo variant="header" />
          </Link>
          {badge ? (
            <span className="inline-flex rounded-full bg-gbandjo-green-light px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gbandjo-green-dark">
              {badge}
            </span>
          ) : null}
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-gbandjo-ink sm:text-[1.75rem]">{title}</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gbandjo-muted">{subtitle}</p>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}