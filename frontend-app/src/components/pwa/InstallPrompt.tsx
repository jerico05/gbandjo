import { useEffect, useState } from 'react'

import { Button } from '../ui/Button'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'gbandjo-pwa-install-dismissed'

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [hidden, setHidden] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
    setIsStandalone(standalone)

    if (standalone || localStorage.getItem(DISMISS_KEY) === '1') {
      setHidden(true)
      return
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }

    function onInstalled() {
      setDeferred(null)
      setHidden(true)
      localStorage.removeItem(DISMISS_KEY)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (isStandalone || !deferred || hidden) return null

  function dismiss() {
    setHidden(true)
    localStorage.setItem(DISMISS_KEY, '1')
  }

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setHidden(true)
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-gbandjo-border bg-white p-3 shadow-lg sm:p-4">
        <p className="text-sm text-gbandjo-ink">Installer Gbandjo sur votre téléphone</p>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="text-xs font-medium text-gbandjo-muted" onClick={dismiss}>
            Plus tard
          </button>
          <Button type="button" className="!px-3 !py-1.5 text-xs" onClick={() => void install()}>
            Installer
          </Button>
        </div>
      </div>
    </div>
  )
}