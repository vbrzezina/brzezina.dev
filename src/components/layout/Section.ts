import styled from '@emotion/styled';

/** Page section: one continuous canvas — sections are separated by space and the eyebrow, not by rules. */
export const Section = styled.section`
  position: relative;
  padding-block: ${({ theme }) => theme.layout.sectionPadding};
  scroll-margin-top: 5.5rem;
`;
