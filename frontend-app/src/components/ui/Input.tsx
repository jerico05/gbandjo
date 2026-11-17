import type { InputHTMLAttributes } from 'react'

import { cn } from '../../lib/utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name
  return (
    <label className="block text-sm font-medium text-gbandjo-ink" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={cn(
          'mt-1 w-full rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gbandjo-green',
          error && 'border-red-400',
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  )
}