import styled from '@emotion/styled'

/** Square 44px icon button (theme toggle, menu open/close). */
export const IconButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.fgSecondary};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.motion.fast} ease,
    color ${({ theme }) => theme.motion.fast} ease,
    transform 100ms ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors.raised};
    color: ${({ theme }) => theme.colors.fg};
  }

  /* Feedback on pointer-down, not release. */
  &:active {
    transform: scale(0.94);
  }

  ${({ theme }) => theme.mq.reducedMotion} {
    &:active {
      transform: none;
    }
  }
`
