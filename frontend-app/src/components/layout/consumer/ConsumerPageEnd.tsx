import { Link } from 'react-router-dom'

import { LogoGbandjo } from '../../branding/LogoGbandjo'

export function ConsumerPageEnd() {
  return (
    <div className="mt-auto border-t border-gbandjo-border/80 bg-white">
      <div className="mx-auto flex max-w-7xl flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-4 sm:px-6 sm:py-5">
        <LogoGbandjo variant="header" />
        <p className="order-3 w-full text-center text-[11px] text-gbandjo-muted sm:order-none sm:w-auto sm:flex-1 sm:text-left sm:text-sm md:text-center">
          Anti gaspi local · retrait chez le commerçant · © {new Date().getFullYear()} Gbandjo
        </p>
        <Link to="/" className="shrink-0 text-xs font-semibold text-gbandjo-green hover:underline sm:text-sm">
          Accueil
        </Link>
      </div>
    </div>
  )
}