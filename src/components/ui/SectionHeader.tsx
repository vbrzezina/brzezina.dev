import styled from '@emotion/styled'
import { type } from '@/styles/typography'

interface SectionHeaderProps {
  index: string
  label: string
  title: string
  titleId: string
  lead?: string
}

const Root = styled.header<{ $split: boolean }>`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};

  ${({ theme }) => theme.mq.lg} {
    ${({ $split }) =>
      $split &&
      `
        grid-template-columns: 7fr 5fr;
        column-gap: 4rem;
        align-items: end;
      `}
  }
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
  max-width: 18ch;
`

const Lead = styled.p`
  ${type.bodyL}
  color: ${({ theme }) => theme.colors.fgSecondary};
  max-width: 34rem;
`

export function SectionHeader({ index, label, title, titleId, lead }: SectionHeaderProps) {
  return (
    <Root $split={Boolean(lead)}>
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
