import styled from '@emotion/styled'
import { type } from '@/styles/typography'

const Pill = styled.p`
  ${type.monoS}
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0.875rem 0.375rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accentSubtle};
  color: ${({ theme }) => theme.colors.fg};
`

const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.success};
  box-shadow: 0 0 0.5rem ${({ theme }) => theme.colors.success};
`

export function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <Pill>
      <Dot aria-hidden="true" />
      {children}
    </Pill>
  )
}
