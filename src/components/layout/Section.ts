import styled from '@emotion/styled';

/** Page section: one canvas, separated by a hairline — never by a background change. */
export const Section = styled.section`
  position: relative;
  padding-block: ${({ theme }) => theme.layout.sectionPadding};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  scroll-margin-top: 5.5rem;
`;
