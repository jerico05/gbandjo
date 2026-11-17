import { cn } from '../../lib/utils/cn'

const LOGO_SRC = '/gbandjo-logo-user.svg'

type LogoGbandjoProps = {
  variant?: 'full' | 'compact' | 'header'
  className?: string
}

export function LogoGbandjo({ variant = 'full', className }: LogoGbandjoProps) {
  return (
    <img
      src={LOGO_SRC}
      alt="Gbandjo"
      width={220}
      height={66}
      className={cn(
        'h-auto object-contain object-left',
        variant === 'compact' && 'max-h-9 w-auto max-w-[min(100%,10.5rem)]',
        variant === 'header' && 'max-h-10 w-auto max-w-[min(100%,11rem)] sm:max-h-11 sm:max-w-[13rem]',
        variant === 'full' && 'max-h-12 w-auto max-w-[min(100%,14rem)] sm:max-h-14 sm:max-w-[16rem]',
        className,
      )}
    />
  )
}