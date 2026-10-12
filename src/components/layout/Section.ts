import styled from '@emotion/styled';

/**
 * Page section. Sections are divided by tone, not rules: every even <section> in <main>
 * sits on a band one step lighter (dark) / darker (light) than the canvas. The hero is
 * section 1, so About, Services and Contact get bands — and reordering keeps the rhythm.
 */
export const Section = styled.section`
  position: relative;
  padding-block: ${({ theme }) => theme.layout.sectionPadding};
  scroll-margin-top: 5.5rem;

  main > &:nth-of-type(even) {
    background: ${({ theme }) => theme.colors.band};
  }
`;
