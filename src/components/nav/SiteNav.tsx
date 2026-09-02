'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { useTranslations, useLocale } from 'next-intl';
import { useThemeToggle } from '@/app/ThemeContext';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { useActiveSection } from '@/hooks/useActiveSection';
import { usePathname, useRouter } from '@/i18n/navigation';

const SECTION_IDS = ['about', 'experience', 'services', 'work', 'contact'] as const;

// ─── Header shell ─────────────────────────────────────────────────────────────

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${({ theme }) => theme.colors.background}cc;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  height: ${({ theme }) => theme.nav.height};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────

const LogoLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.foreground};
  white-space: nowrap;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
  }
`;

const LogoPrompt = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

// ─── Desktop nav (NavigationMenu) ─────────────────────────────────────────────

const NavRoot = styled(NavigationMenu.Root)`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavList = styled(NavigationMenu.List)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavLink = styled(NavigationMenu.Link)`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.9375rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.mutedForeground};
  position: relative;
  padding-bottom: 2px;
  transition: color 150ms ease;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  &[data-active],
  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }

  &[data-active]::after,
  &:hover::after {
    transform: scaleX(1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

// ─── Right cluster ────────────────────────────────────────────────────────────

const RightCluster = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

const LocaleToggle = styled.div`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const LocaleButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.foreground : theme.colors.mutedForeground};
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
  }
`;

const LocaleSeparator = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  opacity: 0.4;
  user-select: none;
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.space[1]};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 1.125rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.space[2]};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
  }
`;

// ─── Mobile nav panel ─────────────────────────────────────────────────────────

interface MobileLinkProps {
  $active: boolean;
}

const MobilePanel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: ${({ theme }) => theme.nav.height};
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  z-index: 49;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavLink = styled.a<MobileLinkProps>`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 1rem;
  text-decoration: none;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.foreground};
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[6]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: color 150ms ease;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
  }
`;

const CvButtonWrapper = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function SiteNav() {
  const t = useTranslations('nav');
  const activeSection = useActiveSection([...SECTION_IDS]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggleTheme } = useThemeToggle();

  function switchLocale(next: 'en' | 'cs') {
    router.replace(pathname, { locale: next });
  }

  const navLinks = SECTION_IDS.map((id) => ({
    id,
    label: t(id),
    href: `#${id}`,
  }));

  return (
    <>
      <Header>
        <Container>
          <Inner>
            <LogoLink href="#hero">
              <LogoPrompt>$ </LogoPrompt>brzezina.dev
            </LogoLink>

            <NavRoot aria-label="Main navigation">
              <NavList>
                {navLinks.map(({ id, label, href }) => (
                  <NavigationMenu.Item key={id}>
                    <NavLink href={href} active={activeSection === id}>
                      {label}
                    </NavLink>
                  </NavigationMenu.Item>
                ))}
              </NavList>
            </NavRoot>

            <RightCluster>
              <LocaleToggle aria-label="Language toggle">
                <LocaleButton
                  type="button"
                  $active={locale === 'en'}
                  onClick={() => switchLocale('en')}
                  aria-pressed={locale === 'en'}
                >
                  EN
                </LocaleButton>
                <LocaleSeparator aria-hidden="true">|</LocaleSeparator>
                <LocaleButton
                  type="button"
                  $active={locale === 'cs'}
                  onClick={() => switchLocale('cs')}
                  aria-pressed={locale === 'cs'}
                >
                  CS
                </LocaleButton>
              </LocaleToggle>

              <ThemeToggleButton
                aria-label="Toggle colour theme"
                type="button"
                onClick={toggleTheme}
              >
                {isDark ? '☀' : '☾'}
              </ThemeToggleButton>

              <CvButtonWrapper>
                <Button $variant="outline" asChild style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  <a href="#" aria-label="Download CV">CV ↓</a>
                </Button>
              </CvButtonWrapper>

              <HamburgerButton
                aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={mobileOpen}
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                ☰
              </HamburgerButton>
            </RightCluster>
          </Inner>
        </Container>
      </Header>

      <MobilePanel $open={mobileOpen} role="navigation" aria-label="Mobile navigation">
        {navLinks.map(({ id, label, href }) => (
          <MobileNavLink
            key={id}
            href={href}
            $active={activeSection === id}
            onClick={() => setMobileOpen(false)}
          >
            {label}
          </MobileNavLink>
        ))}
      </MobilePanel>
    </>
  );
}
