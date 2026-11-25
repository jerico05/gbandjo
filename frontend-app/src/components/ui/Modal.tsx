import { type ReactNode, useEffect } from 'react'

import { cn } from '../../lib/utils/cn'

type ModalProps = {
  title: string
  description?: string
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  footer?: ReactNode
}

export function Modal({ title, description, open, onClose, children, className, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className={cn(
          'flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-xl',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="shrink-0 border-b border-gbandjo-border px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id="modal-title" className="text-base font-bold text-gbandjo-ink sm:text-lg">
                {title}
              </h2>
              {description ? <p className="mt-0.5 text-sm text-gbandjo-muted">{description}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-lg leading-none text-gbandjo-muted hover:bg-gbandjo-surface hover:text-gbandjo-ink"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">{children}</div>
        {footer ? (
          <footer className="shrink-0 border-t border-gbandjo-border bg-gbandjo-surface/40 px-4 py-3 sm:px-5">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  )
}
