import { type ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  href?: string
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gbandjo-green text-white shadow-sm shadow-gbandjo-green/25 hover:bg-gbandjo-green-dark',
  secondary:
    'bg-gbandjo-orange text-white shadow-sm shadow-gbandjo-orange/30 hover:bg-[#e67e00]',
  outline:
    'border-2 border-gbandjo-green text-gbandjo-green hover:bg-gbandjo-green-light',
  ghost: 'text-gbandjo-green hover:bg-gbandjo-green-light',
}

export function Button({
  className,
  variant = 'primary',
  href,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50',
    variantClasses[variant],
    className,
  )

  if (href) {
    const isInternal = href.startsWith('/')
    if (isInternal) {
      return (
        <Link className={classes} to={href}>
          {children}
        </Link>
      )
    }
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}