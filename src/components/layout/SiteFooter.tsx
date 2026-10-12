'use client';

import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Icon, LocaleSwitch, Logo } from '@/components/ui';
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

const Tagline = styled.p`
  ${type.bodyS}
  color: ${({ theme }) => theme.colors.fgSecondary};
  margin-top: 1rem;
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

const BottomActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

export function SiteFooter() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <Footer>
      <Container>
        <Top>
          <div>
            <Logo />
            <Tagline>{t('tagline')}</Tagline>
          </div>

          <nav aria-labelledby="footer-sections">
            <ColumnHeading id="footer-sections">{t('sectionsLabel')}</ColumnHeading>
            <LinkList role="list">
              {SECTION_IDS.map((id) => (
                <li key={id}>
                  <FooterLink href={`#${id}`}>{nav(id)}</FooterLink>
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
                </FooterLink>
              </li>
              <li>
                <FooterLink href={site.cvUrl} download>
                  <Icon name="download" size={16} />
                  {t('downloadCv')}
                </FooterLink>
              </li>
            </LinkList>
          </div>
        </Top>

        <Bottom>
          <Copyright>{t('copyright')}</Copyright>
          <BottomActions>
            <LocaleSwitch />
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
