import { createContext, useContext } from 'react'

export type ConsumerSearchContextValue = {
  query: string
  setQuery: (value: string) => void
}

export const ConsumerSearchContext = createContext<ConsumerSearchContextValue | null>(null)

export function useConsumerSearch() {
  const ctx = useContext(ConsumerSearchContext)
  if (!ctx) {
    return { query: '', setQuery: () => {} }
  }
  return ctx
}