import styled from '@emotion/styled'
import { type } from '@/styles/typography'

/**
 * Bordered mono chips (`[TypeScript] [React]`) for the About stack table.
 * Not interactive, so no hover state — a colour change would read as a link.
 */
const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  li {
    ${type.monoS}
    padding: 0.25rem 0.625rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.sm};
    color: ${({ theme }) => theme.colors.fgSecondary};
    white-space: nowrap;
  }
`

interface TagListProps {
  items: readonly string[]
  label?: string
}

export function TagList({ items, label }: TagListProps) {
  return (
    <List role="list" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </List>
  )
}
