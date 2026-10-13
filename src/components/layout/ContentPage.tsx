'use client';

import styled from '@emotion/styled';
import { SiteNav } from '@/components/nav/SiteNav';
import { SiteFooter } from './SiteFooter';

/**
 * Shell for content pages (privacy policy, future blog): solid header with a hairline,
 * body on the page tone, no hero overlap. The home page keeps its own transparent-header layout.
 */
const Main = styled.main`
  background: ${({ theme }) => theme.colors.page};
`;

interface ContentPageProps {
  /** '/<locale>' — prefix for links back to home-page sections. */
  homeHref: string;
  children: React.ReactNode;
}

export function ContentPage({ homeHref, children }: ContentPageProps) {
  return (
    <>
      <SiteNav homeHref={homeHref} variant="page" />
      <Main id="main">
        {children}
      </Main>
      <SiteFooter homeHref={homeHref} />
    </>
  );
}
