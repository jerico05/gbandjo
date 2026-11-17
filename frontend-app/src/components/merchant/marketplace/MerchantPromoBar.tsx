import { Link } from 'react-router-dom'

import { Icon } from '../../icons/Icon'

export function MerchantPromoBar() {
  return (
    <div className="bg-gradient-to-r from-gbandjo-green to-gbandjo-green-dark px-4 py-2 text-center text-sm font-medium text-white sm:px-8">
      <span className="inline-flex flex-wrap items-center justify-center gap-2">
        <Icon name="sparkle" className="h-4 w-4 shrink-0" />
        Vos offres actives sont visibles sur le
        <Link to="/espace" className="font-bold underline underline-offset-2 hover:text-gbandjo-yellow">
          marketplace Gbandjo
        </Link>
      </span>
    </div>
  )
}