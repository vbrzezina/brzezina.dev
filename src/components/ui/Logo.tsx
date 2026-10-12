import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { type } from '@/styles/typography'

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`

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
  animation: ${blink} 1s steps(1) infinite;

  ${({ theme }) => theme.mq.reducedMotion} {
    animation: none;
  }
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
