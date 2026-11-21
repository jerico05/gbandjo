import { useEffect, useMemo } from 'react'

import { Icon } from '../icons/Icon'
import { cn } from '../../lib/utils/cn'

const MIN_IMAGES = 3

type ProductCreateImageSlotsProps = {
  files: (File | null)[]
  onChange: (files: (File | null)[]) => void
  disabled?: boolean
}

export function ProductCreateImageSlots({ files, onChange, disabled }: ProductCreateImageSlotsProps) {
  const previews = useMemo(
    () => files.map((file) => (file ? URL.createObjectURL(file) : null)),
    [files],
  )

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [previews])

  const filledCount = files.filter(Boolean).length

  function setFile(index: number, file: File | null) {
    const next = [...files]
    next[index] = file
    onChange(next)
  }

  function handlePick(index: number, list: FileList | null) {
    const file = list?.[0] ?? null
    if (!file) return
    if (!file.type.startsWith('image/')) return
    setFile(index, file)
  }

  return (
    <div className="sm:col-span-2">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gbandjo-ink">Photos du produit</p>
          <p className="text-xs text-gbandjo-muted">
            Minimum {MIN_IMAGES} images (JPEG, PNG, WebP). Elles apparaîtront sur le marketplace.
          </p>
        </div>
        <p
          className={cn(
            'text-xs font-semibold tabular-nums',
            filledCount >= MIN_IMAGES ? 'text-gbandjo-green' : 'text-orange-600',
          )}
        >
          {filledCount}/{MIN_IMAGES}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {files.map((file, index) => (
          <div
            key={index}
            className={cn(
              'relative flex min-h-[140px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-3 transition',
              file ? 'border-gbandjo-green/40 bg-gbandjo-green-light/30' : 'border-gbandjo-border bg-white',
            )}
          >
            {previews[index] ? (
              <>
                <img
                  src={previews[index]!}
                  alt=""
                  className="h-24 w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  disabled={disabled}
                  className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                  onClick={() => setFile(index, null)}
                >
                  Retirer
                </button>
              </>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gbandjo-surface text-gbandjo-green">
                  <Icon name="image" className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-gbandjo-ink">Image {index + 1}</span>
                <span className="text-[10px] text-gbandjo-muted">Cliquer pour choisir</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={disabled}
                  onChange={(e) => handlePick(index, e.target.files)}
                />
              </label>
            )}
            {index < MIN_IMAGES ? (
              <span className="absolute right-2 top-2 rounded-md bg-gbandjo-orange/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                Requis
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export const productCreateMinImages = MIN_IMAGES