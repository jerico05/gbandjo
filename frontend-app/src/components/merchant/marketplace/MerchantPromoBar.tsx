import { Link } from 'react-router-dom'

import { Icon } from '../../icons/Icon'

export function MerchantPromoBar() {
  return (
    <div className="bg-gradient-to-r from-gbandjo-green to-gbandjo-green-dark px-3 py-2 text-center text-xs font-medium text-white sm:px-8 sm:text-sm">
      <span className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <Icon name="sparkle" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Vos offres actives sont visibles sur le</span>
        <span className="sm:hidden">Marketplace :</span>
        <Link to="/espace" className="font-bold underline underline-offset-2 hover:text-gbandjo-yellow">
          catalogue Gbandjo
        </Link>
      </span>
    </div>
  )
}