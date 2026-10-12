import styled from '@emotion/styled'
import { type } from '@/styles/typography'

interface SectionHeaderProps {
  index: string
  label: string
  title: string
  titleId: string
  lead?: string
}

/* One reading column: eyebrow → heading → lead, all left-aligned. */
const Root = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`

const Eyebrow = styled.p`
  ${type.monoEyebrow}
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.fgSecondary};
  margin-bottom: ${({ theme }) => theme.space[4]};
`

const Index = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`

const Rule = styled.span`
  display: inline-block;
  width: 2rem;
  height: 1px;
  background: ${({ theme }) => theme.colors.accent};
`

const Title = styled.h2`
  ${type.displayL}
  color: ${({ theme }) => theme.colors.fg};
  max-width: 22ch;
`

const Lead = styled.p`
  ${type.bodyL}
  color: ${({ theme }) => theme.colors.fgSecondary};
  max-width: 40rem;
`

export function SectionHeader({ index, label, title, titleId, lead }: SectionHeaderProps) {
  return (
    <Root>
      <div>
        <Eyebrow>
          <Index>{index}</Index>
          <Rule aria-hidden="true" />
          <span>{label}</span>
        </Eyebrow>
        <Title id={titleId}>{title}</Title>
      </div>
      {lead && <Lead>{lead}</Lead>}
    </Root>
  )
}
