'use client';

import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import * as Dialog from '@radix-ui/react-dialog';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout';
import { Button, Icon, IconButton, LocaleSwitch, Logo, ThemeToggle } from '@/components/ui';
import { SECTION_IDS, site } from '@/data/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrolled } from '@/hooks/useScrolled';
import { type, visuallyHidden } from '@/styles/typography';

// ─── Shell ────────────────────────────────────────────────────────────────────

const SkipLink = styled.a`
  ${type.label}
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 100;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  transform: translateY(-200%);

  &:focus-visible {
    transform: none;
  }
`;

/**
 * Translucent material that only shows its edge once content scrolls under it
 * (scroll-edge effect) — no permanent hard divider.
 */
const Header = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid ${({ theme, $scrolled }) => ($scrolled ? theme.colors.border : 'transparent')};
  background: ${({ theme, $scrolled }) => ($scrolled ? theme.colors.material : 'transparent')};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(20px) saturate(180%)' : 'none')};
  -webkit-backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(20px) saturate(180%)' : 'none')};
  transition:
    background-color 200ms ease,
    border-color 200ms ease;

  @media (prefers-reduced-transparency: reduce) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`;

const Inner = styled.div`
  height: ${({ theme }) => theme.layout.navHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
`;

// ─── Desktop links ────────────────────────────────────────────────────────────

const NavRoot = styled(NavigationMenu.Root)`
  display: none;

  ${({ theme }) => theme.mq.md} {
    display: flex;
  }
`;

const NavList = styled(NavigationMenu.List)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const NavLink = styled(NavigationMenu.Link)`
  ${type.label}
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding-inline: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.fgSecondary};
  transition: color ${({ theme }) => theme.motion.fast} ease;

  /* Active indicator: a small accent dot, scaled in from the link's centre. */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0.3rem;
    width: 4px;
    height: 4px;
    margin-left: -2px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    transform: scale(0);
    transition: transform 200ms ${({ theme }) => theme.motion.ease};
  }

  &:hover,
  &[data-active] {
    color: ${({ theme }) => theme.colors.fg};
  }

  &[data-active]::after {
    transform: scale(1);
  }
`;

// ─── Right cluster ────────────────────────────────────────────────────────────

const Cluster = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DesktopOnly = styled.div`
  display: none;

  ${({ theme }) => theme.mq.md} {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const MenuButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.fg};

  ${({ theme }) => theme.mq.md} {
    display: none;
  }
`;

// ─── Mobile sheet ─────────────────────────────────────────────────────────────

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeOut = keyframes`from { opacity: 1; } to { opacity: 0; }`;
// Enters from the edge the trigger lives on and leaves along the same path.
const sheetIn = keyframes`from { opacity: 0; transform: translateY(-0.75rem); } to { opacity: 1; transform: none; }`;
const sheetOut = keyframes`from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(-0.75rem); }`;

const Scrim = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: oklch(0.1 0.02 255 / 55%);

  &[data-state='open'] {
    animation: ${fadeIn} 240ms ease;
  }
  &[data-state='closed'] {
    animation: ${fadeOut} 200ms ease;
  }
`;

const Sheet = styled(Dialog.Content)`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 61;
  max-height: 100dvh;
  overflow-y: auto;
  /* Larger surface → heavier material than the nav bar. */
  background: color-mix(in oklch, ${({ theme }) => theme.colors.canvas} 92%, transparent);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0 0 ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md};
  padding-bottom: 1.5rem;

  &[data-state='open'] {
    animation: ${sheetIn} 320ms ${({ theme }) => theme.motion.ease};
  }
  &[data-state='closed'] {
    animation: ${sheetOut} 200ms ease-in;
  }

  ${({ theme }) => theme.mq.reducedMotion} {
    &[data-state='open'] {
      animation: ${fadeIn} 200ms ease;
    }
    &[data-state='closed'] {
      animation: ${fadeOut} 150ms ease;
    }
  }

  @media (prefers-reduced-transparency: reduce) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`;

const SheetTitle = styled(Dialog.Title)`
  ${visuallyHidden}
`;

const SheetLinks = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
`;

const SheetLink = styled.a<{ $active: boolean }>`
  ${type.titleL}
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-block: 0.875rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.fg)};

  span {
    ${type.monoS}
    color: ${({ theme }) => theme.colors.fgTertiary};
  }
`;

const SheetFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

const SheetActions = styled.div`
  align-self: stretch;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function SiteNav() {
  const t = useTranslations('nav');
  const a11y = useTranslations('a11y');
  const activeSection = useActiveSection(SECTION_IDS);
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  // In-page target picked from the sheet; focus goes there instead of back to the trigger.
  const pendingTarget = useRef<string | null>(null);

  function navigateFromSheet(id: string) {
    pendingTarget.current = id;
    setOpen(false);
  }

  function handleCloseAutoFocus(event: Event) {
    const id = pendingTarget.current;
    pendingTarget.current = null;
    const target = id ? document.getElementById(id) : null;
    if (!target) return; // Escape / close button / scrim: Radix returns focus to the trigger.

    event.preventDefault();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  const links = SECTION_IDS.map((id, i) => ({
    id,
    index: String(i + 1).padStart(2, '0'),
    label: t(id),
    href: `#${id}`,
  }));

  return (
    <>
      <SkipLink href="#main">{a11y('skip')}</SkipLink>
      <Header $scrolled={scrolled || open}>
        <Container>
          <Inner>
            <Logo />

            <NavRoot aria-label={a11y('mainNav')}>
              <NavList role="list">
                {links.map(({ id, label, href }) => (
                  <NavigationMenu.Item key={id}>
                    <NavLink href={href} active={activeSection === id}>
                      {label}
                    </NavLink>
                  </NavigationMenu.Item>
                ))}
              </NavList>
            </NavRoot>

            <Cluster>
              <DesktopOnly>
                <LocaleSwitch />
              </DesktopOnly>
              <ThemeToggle />
              <DesktopOnly>
                <Button $variant="secondary" $size="sm" asChild>
                  <a href={site.cvUrl} download aria-label={t('downloadCv')}>
                    {t('cv')}
                    <Icon name="download" size={16} />
                  </a>
                </Button>
              </DesktopOnly>

              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                  <MenuButton type="button" aria-label={a11y('openMenu')}>
                    <Icon name="menu" />
                  </MenuButton>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Scrim />
                  <Sheet aria-describedby={undefined} onCloseAutoFocus={handleCloseAutoFocus}>
                    <SheetTitle>{a11y('menu')}</SheetTitle>
                    <Container>
                      <Inner>
                        <Logo onClick={() => navigateFromSheet('top')} />
                        <Dialog.Close asChild>
                          <MenuButton type="button" aria-label={a11y('closeMenu')}>
                            <Icon name="close" />
                          </MenuButton>
                        </Dialog.Close>
                      </Inner>
                      <nav aria-label={a11y('mainNav')}>
                        <SheetLinks role="list">
                          {links.map(({ id, index, label, href }) => (
                            <li key={id}>
                              <SheetLink
                                href={href}
                                $active={activeSection === id}
                                aria-current={activeSection === id ? 'location' : undefined}
                                onClick={() => navigateFromSheet(id)}
                              >
                                <span aria-hidden="true">{index}</span>
                                {label}
                              </SheetLink>
                            </li>
                          ))}
                        </SheetLinks>
                      </nav>
                      <SheetFooter>
                        <LocaleSwitch />
                        <SheetActions>
                          <Button $variant="secondary" asChild>
                            <a href={site.cvUrl} download>
                              {t('downloadCv')}
                              <Icon name="download" size={16} />
                            </a>
                          </Button>
                          <Button asChild>
                            <a href="#contact" onClick={() => navigateFromSheet('contact')}>
                              {t('getInTouch')}
                            </a>
                          </Button>
                        </SheetActions>
                      </SheetFooter>
                    </Container>
                  </Sheet>
                </Dialog.Portal>
              </Dialog.Root>
            </Cluster>
          </Inner>
        </Container>
      </Header>
    </>
  );
}
