import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'

interface SectionHeadingProps {
  index: string
  slug: string
  title: string
  lead?: string
}

const EyebrowRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const EyebrowIndex = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
`

const EyebrowDash = styled.span`
  display: inline-block;
  width: 2rem;
  height: 1px;
  background: currentColor;
  vertical-align: middle;
  color: ${({ theme }) => theme.colors.primary};
`

const EyebrowSlug = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
`

const Heading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.foreground};
  margin-top: 1rem;
  margin-bottom: 0;
`

const Lead = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-top: 1rem;
  margin-bottom: 0;
  font-size: 1.125rem;
  line-height: 1.6;
`

export function SectionHeading({ index, slug, title, lead }: SectionHeadingProps) {
  // useTheme kept for potential future direct theme access within this component
  useTheme()

  return (
    <div>
      <EyebrowRow>
        <EyebrowIndex>{index}</EyebrowIndex>
        <EyebrowDash aria-hidden="true" />
        <EyebrowSlug>{slug}</EyebrowSlug>
      </EyebrowRow>
      <Heading>{title}</Heading>
      {lead && <Lead>{lead}</Lead>}
    </div>
  )
}
