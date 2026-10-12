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

const Cursor = styled.span`
  display: inline-block;
  width: 0.55ch;
  height: 1.05em;
  margin-left: 0.1ch;
  background: ${({ theme }) => theme.colors.accent};
  /* Static on purpose: an endless blink pulls the eye in peripheral vision (and WCAG 2.2.2
     requires a pause control for blinking content that runs longer than 5s). */
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
      <Cursor aria-hidden="true" />
    </Root>
  )
}
