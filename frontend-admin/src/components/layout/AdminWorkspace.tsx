import type { ReactNode } from 'react'

type AdminWorkspaceProps = {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function AdminWorkspace({ title, description, actions, children }: AdminWorkspaceProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {title ? (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gbandjo-ink sm:text-2xl">{title}</h2>
            {description ? <p className="mt-1 max-w-2xl text-sm text-gbandjo-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </div>
  )
}