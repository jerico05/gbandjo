import type { ReactNode } from 'react'

type MerchantWorkspaceProps = {
  children: ReactNode
  title?: string
}

export function MerchantWorkspace({ children, title }: MerchantWorkspaceProps) {
  return (
    <section className="rounded-3xl border border-gbandjo-border bg-white shadow-sm">
      {title ? (
        <div className="border-b border-gbandjo-border px-5 py-4 sm:px-8">
          <h1 className="text-lg font-bold text-gbandjo-ink">{title}</h1>
        </div>
      ) : null}
      <div className="p-5 sm:p-8">{children}</div>
    </section>
  )
}