'use client'

import styled from '@emotion/styled'
import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  as?: React.ElementType
  className?: string
}

const Wrapper = styled.div<{ $visible: boolean; $delay: number }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'none' : 'translateY(1rem)')};
  transition:
    opacity ${({ theme }) => `${theme.motion.reveal} ${theme.motion.ease}`},
    transform ${({ theme }) => `${theme.motion.reveal} ${theme.motion.ease}`};
  transition-delay: ${({ $delay }) => $delay}ms;

  /* Reduced motion: keep the fade (non-vestibular), drop the movement. */
  ${({ theme }) => theme.mq.reducedMotion} {
    transform: none;
    transition: opacity 200ms ease;
    transition-delay: 0ms;
  }
`

export function Reveal({ children, delay, as, className }: RevealProps) {
  const [ref, visible] = useReveal<HTMLDivElement>()

  return (
    <Wrapper as={as} ref={ref} className={className} $visible={visible} $delay={delay ?? 0}>
      {children}
    </Wrapper>
  )
}
