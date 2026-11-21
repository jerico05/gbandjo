import type { ReactElement } from 'react'

type IconName =
  | 'layout'
  | 'users'
  | 'store'
  | 'tag'
  | 'search'
  | 'bell'
  | 'menu'
  | 'eye'

type IconProps = {
  name: IconName
  className?: string
}

const paths: Record<IconName, ReactElement> = {
  layout: <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h14v16H8V8Zm18 0h14v10H26V8ZM26 26h14v14H26V26ZM8 32h14v8H8v-8Z" />,
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm16 2a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM8 38c0-6 4.5-10 10-10s10 4 10 10M26 38c0-4.5 3-7.5 8-7.5"
    />
  ),
  store: <path strokeLinecap="round" strokeLinejoin="round" d="M8 18 16 8h16l8 10v22H8V18Zm12 12v12M28 30v12" />,
  tag: <path strokeLinecap="round" strokeLinejoin="round" d="M10 10h16l14 14-16 16H10V10Zm10 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />,
  search: <path strokeLinecap="round" strokeLinejoin="round" d="M32 32 42 42M20 34a14 14 0 1 1 0-28 14 14 0 0 1 0 28Z" />,
  bell: <path strokeLinecap="round" strokeLinejoin="round" d="M20 8a12 12 0 0 1 12 12v8l4 4H4l4-4v-8A12 12 0 0 1 20 8Zm0 28a4 4 0 0 0 4-4" />,
  menu: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h32M8 24h32M8 36h32" />,
  eye: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 24c0 0 7-9 15-9s15 9 15 9-7 9-15 9-15-9-15-9Z"
      />
      <circle cx="24" cy="24" r="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
}

export function Icon({ name, className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden>
      {paths[name]}
    </svg>
  )
}