'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Script from 'next/script';
import { gtmId } from '@/data/site';

/**
 * Analytics consent (GDPR + Czech Electronic Communications Act §89(3)).
 *
 * - Google Tag Manager is not loaded at all until the visitor accepts — no script, no requests.
 * - Consent Mode v2 defaults are still set to "denied" before GTM boots, then updated, so GA4
 *   inside the container receives the correct signals. Ad storage is never granted.
 * - Rejecting after accepting updates consent and deletes Google Analytics cookies.
 * - A decision is remembered for 12 months, then the visitor is asked again.
 * - Without NEXT_PUBLIC_GTM_ID there is nothing optional on the site, so no banner is shown.
 */

export type ConsentChoice = 'granted' | 'denied';

const STORAGE_KEY = 'consent';
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

interface StoredConsent {
  analytics: ConsentChoice;
  date: string;
}

interface ConsentContextValue {
  /** Whether consent is relevant at all (a GTM container is configured). */
  enabled: boolean;
  analytics: ConsentChoice | null;
  bannerOpen: boolean;
  accept: () => void;
  reject: () => void;
  openSettings: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  enabled: false,
  analytics: null,
  bannerOpen: false,
  accept: () => {},
  reject: () => {},
  openSettings: () => {},
});

type Gtag = (...args: unknown[]) => void;
type WindowWithDataLayer = Window & { dataLayer?: unknown[]; gtag?: Gtag };

function readStored(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.analytics !== 'granted' && parsed.analytics !== 'denied') return null;
    if (Date.now() - new Date(parsed.date).getTime() > MAX_AGE_MS) return null;
    return parsed.analytics;
  } catch {
    return null;
  }
}

function writeStored(analytics: ConsentChoice) {
  try {
    const value: StoredConsent = { analytics, date: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage unavailable — the choice still applies for this visit.
  }
}

/** Remove GA cookies (`_ga`, `_ga_<id>`) on every domain level they may have been set on. */
function deleteAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  const parts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join('.')}`);
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

/** Inline bootstrap: Consent Mode v2 defaults (denied), the visitor's grant, then the standard GTM loader. */
function gtmBootstrap(id: string) {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
gtag('consent', 'update', { analytics_storage: 'granted' });
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');
`;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const enabled = gtmId !== null;
  // `undefined` until mounted: the server can't know the stored choice, so nothing renders yet.
  const [analytics, setAnalytics] = useState<ConsentChoice | null | undefined>(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setAnalytics(enabled ? readStored() : null);
  }, [enabled]);

  const accept = useCallback(() => {
    writeStored('granted');
    setAnalytics('granted');
    setSettingsOpen(false);
    // If GTM was already loaded earlier in this visit, re-grant through Consent Mode.
    (window as WindowWithDataLayer).gtag?.('consent', 'update', { analytics_storage: 'granted' });
  }, []);

  const reject = useCallback(() => {
    writeStored('denied');
    setAnalytics('denied');
    setSettingsOpen(false);
    (window as WindowWithDataLayer).gtag?.('consent', 'update', { analytics_storage: 'denied' });
    deleteAnalyticsCookies();
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);

  const bannerOpen = enabled && analytics !== undefined && (analytics === null || settingsOpen);

  return (
    <ConsentContext.Provider
      value={{ enabled, analytics: analytics ?? null, bannerOpen, accept, reject, openSettings }}
    >
      {children}
      {enabled && analytics === 'granted' && gtmId && (
        <Script id="gtm-bootstrap" strategy="afterInteractive">
          {gtmBootstrap(gtmId)}
        </Script>
      )}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
