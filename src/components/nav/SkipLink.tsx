'use client';

import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { type } from '@/styles/typography';

/** First focusable element on every page — rendered by the layout, ahead of the consent banner. */
const Link = styled.a`
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

/*
 * <main> is deliberately not focusable at rest: Next.js focuses the page's first element after a
 * route change, and a focusable <main> taller than the viewport gets scrolled under the sticky
 * header. The skip link makes it focusable just for the jump.
 */
function skipToMain(event: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('main');
  if (!target) return;
  event.preventDefault();
  target.setAttribute('tabindex', '-1');
  target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  target.focus();
}

export function SkipLink() {
  const t = useTranslations('a11y');
  return (
    <Link href="#main" onClick={skipToMain}>
      {t('skip')}
    </Link>
  );
}
