import styled from '@emotion/styled'

export const Tag = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.25rem 0.625rem;
  border-radius: ${({ theme }) => theme.radius.base};
  transition:
    border-color 200ms,
    color 200ms;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`
