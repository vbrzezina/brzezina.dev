import styled from '@emotion/styled'
import { type } from '@/styles/typography'

/**
 * Dot-separated mono list (`TypeScript · React · NestJS`).
 * A real <ul> so screen readers announce a list; separators are CSS-only.
 */
const List = styled.ul<{ $tone: 'secondary' | 'tertiary' }>`
  ${type.monoS}
  display: flex;
  flex-wrap: wrap;
  row-gap: 0.25rem;
  color: ${({ theme, $tone }) => ($tone === 'secondary' ? theme.colors.fgSecondary : theme.colors.fgTertiary)};

  li:not(:last-of-type)::after {
    content: '·';
    margin-inline: 0.6em;
    color: ${({ theme }) => theme.colors.fgTertiary};
  }
`

interface StackListProps {
  items: readonly string[]
  tone?: 'secondary' | 'tertiary'
  label?: string
}

export function StackList({ items, tone = 'tertiary', label }: StackListProps) {
  return (
    <List role="list" $tone={tone} aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </List>
  )
}
