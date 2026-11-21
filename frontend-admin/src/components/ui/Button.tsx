import { type ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  href?: string
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gbandjo-blue text-white shadow-sm shadow-gbandjo-blue/25 hover:bg-gbandjo-blue-dark',
  secondary: 'bg-gbandjo-cyan text-white shadow-sm hover:opacity-95',
  outline: 'border-2 border-gbandjo-blue text-gbandjo-blue hover:bg-gbandjo-blue-light',
  ghost: 'text-gbandjo-blue hover:bg-gbandjo-blue-light',
  danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
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
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50',
    variantClasses[variant],
    className,
  )

  if (href) {
    return (
      <Link className={classes} to={href}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}