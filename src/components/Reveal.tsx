'use client'

import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  as?: React.ElementType
  className?: string
  /**
   * For content that is on screen at load (the hero). It enters with a CSS animation that needs no
   * script, instead of starting hidden until hydration and an IntersectionObserver callback — which
   * would hold the largest paint back by the length of the JavaScript download.
   */
  eager?: boolean
}

const enter = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: none; }
`

const fade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const Observed = styled.div<{ $visible: boolean; $delay: number }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'none' : 'translateY(1rem)')};
  transition:
    opacity ${({ theme }) => `${theme.motion.reveal} ${theme.motion.ease}`},
    transform ${({ theme }) => `${theme.motion.reveal} ${theme.motion.ease}`};
  /* Stagger only where blocks sit side by side; stacked on a phone each one enters on its own,
     so a delay is just lag. */
  ${({ theme }) => theme.mq.md} {
    transition-delay: ${({ $delay }) => $delay}ms;
  }

  /* Reduced motion: keep the fade (non-vestibular), drop the movement. */
  ${({ theme }) => theme.mq.reducedMotion} {
    transform: none;
    transition: opacity 200ms ease;
    transition-delay: 0ms;
  }
`

const Eager = styled.div<{ $delay: number }>`
  animation: ${enter} ${({ theme }) => `${theme.motion.reveal} ${theme.motion.ease}`} both;

  ${({ theme }) => theme.mq.md} {
    animation-delay: ${({ $delay }) => $delay}ms;
  }

  ${({ theme }) => theme.mq.reducedMotion} {
    animation: ${fade} 200ms ease both;
  }
`

function ObservedReveal({ children, delay, as, className }: RevealProps) {
  const [ref, visible] = useReveal<HTMLDivElement>()

  return (
    <Observed as={as} ref={ref} className={className} data-reveal="" $visible={visible} $delay={delay ?? 0}>
      {children}
    </Observed>
  )
}

export function Reveal(props: RevealProps) {
  if (!props.eager) return <ObservedReveal {...props} />

  const { children, delay, as, className } = props
  return (
    <Eager as={as} className={className} data-reveal="" $delay={delay ?? 0}>
      {children}
    </Eager>
  )
}
