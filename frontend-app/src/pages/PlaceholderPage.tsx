import { Container } from '../components/ui/Container'

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Container className="py-16 text-center">
      <h1 className="text-3xl font-extrabold text-gbandjo-ink">{title}</h1>
      <p className="mx-auto mt-4 max-w-lg text-gbandjo-muted">{description}</p>
    </Container>
  )
}