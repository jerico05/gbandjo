import { Link } from 'react-router-dom'

import { Icon } from '../icons/Icon'
import { cn } from '../../lib/utils/cn'

type AdminViewDetailButtonProps = {
  to: string
  label?: string
  className?: string
}

export function AdminViewDetailButton({
  to,
  label = 'Voir les informations',
  className,
}: AdminViewDetailButtonProps) {
  return (
    <Link
      to={to}
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-gbandjo-blue/35',
        'bg-gbandjo-blue-light text-gbandjo-blue shadow-sm transition',
        'hover:border-gbandjo-blue hover:bg-gbandjo-blue hover:text-white hover:shadow-md',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gbandjo-blue',
        className,
      )}
    >
      <Icon name="eye" className="h-[22px] w-[22px]" />
    </Link>
  )
}