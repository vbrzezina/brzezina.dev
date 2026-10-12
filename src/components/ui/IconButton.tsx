import styled from '@emotion/styled'

/** Square icon button: 44px touch target on mobile, 40px on desktop to match the other nav controls. */
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
    transform: scale(0.97);
  }

  ${({ theme }) => theme.mq.md} {
    width: 2.5rem;
    height: 2.5rem;
  }

  ${({ theme }) => theme.mq.reducedMotion} {
    &:active {
      transform: none;
    }
  }
`
