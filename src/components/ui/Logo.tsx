import styled from '@emotion/styled'
import { type } from '@/styles/typography'

const Root = styled.a`
  ${type.monoBody}
  display: inline-flex;
  align-items: center;
  gap: 0.5ch;
  min-height: 2.75rem;
  color: ${({ theme }) => theme.colors.fg};
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.radius.sm};
`

const Prompt = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`

interface LogoProps {
  href?: string
  onClick?: () => void
}

export function Logo({ href = '#top', onClick }: LogoProps) {
  return (
    <Root href={href} onClick={onClick} aria-label="brzezina.dev">
      <Prompt aria-hidden="true">$</Prompt>
      <span aria-hidden="true">brzezina.dev</span>
    </Root>
  )
}
