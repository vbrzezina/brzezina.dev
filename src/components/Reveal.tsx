'use client'

import styled from '@emotion/styled'
import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  as?: React.ElementType
}

const Wrapper = styled.div<{ $visible: boolean; $delay: number }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'none' : 'translateY(1.25rem)')};
  transition:
    opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: ${({ $delay }) => $delay}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`

export function Reveal({ children, delay, as }: RevealProps) {
  const [ref, visible] = useReveal<HTMLDivElement>()

  return (
    <Wrapper as={as} ref={ref} $visible={visible} $delay={delay ?? 0}>
      {children}
    </Wrapper>
  )
}
