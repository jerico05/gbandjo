import type { ReactElement } from 'react'

export type IconName =
  | 'bag'
  | 'store'
  | 'cart'
  | 'category'
  | 'home'
  | 'sparkle'
  | 'package'
  | 'percent'
  | 'image'
  | 'dashboard'
  | 'products'
  | 'offers'
  | 'reservations'
  | 'bell'
  | 'search'
  | 'grid'
  | 'list'
  | 'trash'
  | 'edit'
  | 'filter'
  | 'message'
  | 'settings'
  | 'lock'
  | 'user'
  | 'heart'
  | 'star'
  | 'truck'
  | 'shield'
  | 'refresh'

type IconProps = {
  name: IconName
  className?: string
  title?: string
}

const paths: Record<IconName, ReactElement> = {
  bag: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h32v26H8V10Zm4-4h24l2 4H10l2-4Zm12 14v8M20 24h8"
    />
  ),
  store: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 18 14 8h20l6 10v20H8V18Zm10 10v12M30 28v12M20 28h12"
    />
  ),
  cart: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h4l5 18h16l4-14H18M14 36h20M22 40a2 2 0 1 1-4 0M34 40a2 2 0 1 1-4 0" />
  ),
  category: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h14v14H8V8Zm22 0h14v14H30V8ZM8 30h14v14H8V30Zm22 0h14v14H30V30Z" />
  ),
  home: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20 24 8l14 12v22H10V20Zm14 10v12H18V30h6Z" />
  ),
  sparkle: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M24 6v8M24 34v8M6 24h8M34 24h8M11 11l5.5 5.5M31.5 31.5 37 37M37 11l-5.5 5.5M11 37l5.5-5.5"
    />
  ),
  package: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 16 24 8l14 8v24H10V16Zm14-8v24M10 16l14 8 14-8" />
  ),
  percent: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 32 32 16M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  ),
  image: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 12h28v24H10V12Zm0 16 6-6 8 8 6-6 8 8"
    />
  ),
  dashboard: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h14v14H8V8Zm18 0h14v8H26V8ZM26 24h14v16H26V24ZM8 30h14v10H8V30Z" />
  ),
  products: <path strokeLinecap="round" strokeLinejoin="round" d="M10 16 24 8l14 8v24H10V16Zm14-8v24M10 16l14 8 14-8" />,
  offers: <path strokeLinecap="round" strokeLinejoin="round" d="M10 10h16l14 14-16 16H10V10Zm10 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />,
  reservations: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 8h28v32H10V8Zm6 10h16M16 22h12M16 30h8" />
  ),
  bell: <path strokeLinecap="round" strokeLinejoin="round" d="M20 8a12 12 0 0 1 12 12v8l4 4H4l4-4v-8A12 12 0 0 1 20 8Zm0 28a4 4 0 0 0 4-4" />,
  search: <path strokeLinecap="round" strokeLinejoin="round" d="M32 32 42 42M20 34a14 14 0 1 1 0-28 14 14 0 0 1 0 28Z" />,
  grid: <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h14v14H8V8Zm18 0h14v14H26V8ZM8 26h14v14H8V26Zm18 0h14v14H26V26Z" />,
  list: <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h28M10 24h28M10 36h28M10 12h.01M10 24h.01M10 36h.01" />,
  trash: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 18v20M32 18v20M12 14h24l-2 28H14L12 14Zm6-6h12l2 6H16l2-6Z"
    />
  ),
  edit: <path strokeLinecap="round" strokeLinejoin="round" d="M32 10l6 6-18 18h-6v-6L32 10Z" />,
  filter: <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h32l-12 16v14l-8-4v-10L8 10Z" />,
  message: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 12h28v20H10V12Zm0 8 14 8 14-8"
    />
  ),
  settings: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M24 8v6M24 34v6M8 24h6M34 24h6M14.5 14.5l4 4M29.5 29.5l4 4M33.5 14.5l-4 4M18.5 29.5l-4 4"
    />
  ),
  lock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 22v-6a8 8 0 1 1 16 0v6m-20 0h24v18H12V22Z"
    />
  ),
  user: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M24 10a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-12 28c0-8 5.4-12 12-12s12 4 12 12"
    />
  ),
  heart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M24 38s-14-9.2-14-18a8 8 0 0 1 14-5.6A8 8 0 0 1 38 20c0 8.8-14 18-14 18Z"
    />
  ),
  star: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m24 8 4.2 8.5 9.4 1.4-6.8 6.6 1.6 9.2L24 29.8l-8.4 4.4 1.6-9.2-6.8-6.6 9.4-1.4L24 8Z"
    />
  ),
  truck: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 32V20h20v12M28 24h6l6 8v4H8M16 36h4M32 36h4"
    />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M24 6 10 12v12c0 10 6.5 16 14 18 7.5-2 14-8 14-18V12L24 6Z"
    />
  ),
  refresh: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M38 18A14 14 0 1 0 22 38m16-20v8h-8"
    />
  ),
}

const categoryIcons: IconName[] = ['store', 'sparkle', 'home', 'package', 'category', 'bag']

export function categoryIconAt(index: number): IconName {
  return categoryIcons[index % categoryIcons.length]
}

export function Icon({ name, className = 'h-6 w-6', title }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  )
}