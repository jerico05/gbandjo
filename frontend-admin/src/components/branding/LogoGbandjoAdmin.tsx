import { cn } from '../../lib/utils/cn'

const LOGO_SRC = '/gbandjo-logo-admin.svg'

type LogoGbandjoAdminProps = {
  variant?: 'full' | 'sidebar'
  className?: string
}

export function LogoGbandjoAdmin({ variant = 'full', className }: LogoGbandjoAdminProps) {
  return (
    <img
      src={LOGO_SRC}
      alt="Gbandjo Admin"
      width={220}
      height={66}
      className={cn(
        'block h-auto object-contain object-left',
        variant === 'sidebar' && 'max-h-10 w-full max-w-[min(100%,12.5rem)]',
        variant === 'full' && 'max-h-12 w-full max-w-[min(100%,14rem)] sm:max-h-14 sm:max-w-[16rem]',
        className,
      )}
    />
  )
}