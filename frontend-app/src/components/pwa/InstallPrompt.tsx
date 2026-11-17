import { useEffect, useState } from 'react'

import { Button } from '../ui/Button'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  if (!deferred || hidden) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-gbandjo-border bg-white p-4 shadow-lg sm:left-auto">
      <p className="text-sm text-gbandjo-ink">Installez Gbandjo sur votre écran d&apos;accueil.</p>
      <div className="flex shrink-0 gap-2">
        <button type="button" className="text-xs text-gbandjo-muted" onClick={() => setHidden(true)}>
          Plus tard
        </button>
        <Button
          type="button"
          className="!px-3 !py-1.5 text-xs"
          onClick={() =>
            void deferred.prompt().then(() => {
              setDeferred(null)
              setHidden(true)
            })
          }
        >
          Installer
        </Button>
      </div>
    </div>
  )
}