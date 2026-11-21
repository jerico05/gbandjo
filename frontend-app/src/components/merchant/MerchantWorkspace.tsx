import type { ReactNode } from 'react'

type MerchantWorkspaceProps = {
  children: ReactNode
  title?: string
}

export function MerchantWorkspace({ children, title }: MerchantWorkspaceProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-sm sm:rounded-3xl">
      {title ? (
        <div className="border-b border-gbandjo-border px-4 py-3.5 sm:px-8 sm:py-4">
          <h1 className="text-base font-bold text-gbandjo-ink sm:text-lg">{title}</h1>
        </div>
      ) : null}
      <div className="p-4 sm:p-8">{children}</div>
    </section>
  )
}