'use client';

import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Icon, Logo, VisuallyHidden } from '@/components/ui';
import { useConsent } from '@/components/consent';
import { Link } from '@/i18n/navigation';
import { SECTION_IDS, site } from '@/data/site';
import { type } from '@/styles/typography';
import { Container } from './Container';

const Footer = styled.footer`
  padding-block: 4rem 2rem;
`;

const Top = styled.div`
  display: grid;
  gap: 2.5rem;

  ${({ theme }) => theme.mq.md} {
    grid-template-columns: 6fr 3fr 3fr;
  }
`;

/* The logo keeps its 44px tap target; pulling it up puts its text on the column headings' line. */
const Brand = styled.div`
  margin-top: -0.8125rem;
`;

const Tagline = styled.p`
  ${type.bodyS}
  color: ${({ theme }) => theme.colors.fgSecondary};
  /* First line sits level with the first link in the neighbouring columns. */
  margin-top: 0.1875rem;
  max-width: 28rem;
`;

const ColumnHeading = styled.h2`
  ${type.monoEyebrow}
  color: ${({ theme }) => theme.colors.fgTertiary};
  margin-bottom: 0.75rem;
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const FooterLink = styled.a`
  ${type.bodyS}
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.25rem;
  color: ${({ theme }) => theme.colors.fgSecondary};
  transition: color ${({ theme }) => theme.motion.fast} ease;

  &:hover {
    color: ${({ theme }) => theme.colors.fg};
  }
`;

const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Copyright = styled.p`
  ${type.monoS}
  color: ${({ theme }) => theme.colors.fgTertiary};
`;

const TextButton = styled.button`
  ${type.bodyS}
  display: inline-flex;
  align-items: center;
  min-height: 2.25rem;
  padding: 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.fgSecondary};
  cursor: pointer;
  transition: color ${({ theme }) => theme.motion.fast} ease;

  &:hover {
    color: ${({ theme }) => theme.colors.fg};
  }
`;

const BottomActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 1.5rem;
`;

interface SiteFooterProps {
  /** Prefix for section links — '' on the home page, '/<locale>' on other pages. */
  homeHref?: string;
}

export function SiteFooter({ homeHref = '' }: SiteFooterProps) {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const a11y = useTranslations('a11y');
  const consent = useConsent();

  return (
    <Footer>
      <Container>
        <Top>
          <div>
            <Brand>
              <Logo href={`${homeHref}#top`} />
            </Brand>
            <Tagline>{t('tagline')}</Tagline>
          </div>

          <nav aria-labelledby="footer-sections">
            <ColumnHeading id="footer-sections">{t('sectionsLabel')}</ColumnHeading>
            <LinkList role="list">
              {SECTION_IDS.map((id) => (
                <li key={id}>
                  <FooterLink href={`${homeHref}#${id}`}>{nav(id)}</FooterLink>
                </li>
              ))}
            </LinkList>
          </nav>

          <div>
            <ColumnHeading>{t('elsewhereLabel')}</ColumnHeading>
            <LinkList role="list">
              <li>
                <FooterLink href={site.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="github" size={16} />
                  {site.githubLabel}
                  <VisuallyHidden> {a11y('newTab')}</VisuallyHidden>
                </FooterLink>
              </li>
              <li>
                <FooterLink href={site.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="linkedin" size={16} />
                  {site.linkedinLabel}
                  <VisuallyHidden> {a11y('newTab')}</VisuallyHidden>
                </FooterLink>
              </li>
            </LinkList>
          </div>
        </Top>

        <Bottom>
          <Copyright>{t('copyright')}</Copyright>
          <BottomActions>
            <FooterLink as={Link} href="/privacy">
              {t('privacy')}
            </FooterLink>
            {consent.enabled && (
              <TextButton type="button" onClick={consent.openSettings}>
                {t('cookieSettings')}
              </TextButton>
            )}
            <FooterLink href="#top">
              {t('backToTop')}
              <Icon name="arrowUp" size={16} />
            </FooterLink>
          </BottomActions>
        </Bottom>
      </Container>
    </Footer>
  );
}
