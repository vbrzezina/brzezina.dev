---
name: ga4-gtm-setup
description: Set up and verify the full analytics stack for brzezina.dev: Google Tag Manager container, GA4 configuration tag, custom event triggers, Vercel Analytics, and Google Search Console connection. Run when setting up analytics from scratch, adding new tracked events, or verifying tracking is working correctly.
---

# GA4 + GTM Setup Skill

Configure and verify the analytics stack: GTM → GA4 + Vercel Analytics + Search Console.

## Architecture

```
Browser
  └── GTM snippet (loaded in <head>)
        ├── GA4 Configuration Tag (fires on all pages)
        ├── Custom Event Tags (contact_form_submit, cv_download, etc.)
        └── Other future tags
  └── @vercel/analytics (independent, cookieless)

Google Search Console (verification via meta tag, independent of GA)
```

## Phase 1: GTM container setup

### 1.1 Create GTM account and container

1. Go to https://tagmanager.google.com
2. Create account: "Václav Brzezina"
3. Create container: `brzezina.dev`, target: Web
4. Note the Container ID: `GTM-XXXXXXX`
5. Add to Vercel env vars: `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`

### 1.2 Add GTM snippet to Next.js

```tsx
// app/layout.tsx
import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}</Script>
        )}
      </head>
      <body>
        {GTM_ID && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0" width="0" style={{ display:'none', visibility:'hidden' }} />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
```

## Phase 2: GA4 configuration in GTM

### 2.1 Create GA4 property

1. Google Analytics → Admin → Create Property: "brzezina.dev"
2. Note the Measurement ID: `G-XXXXXXXXXX`
3. Add to Vercel env vars: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

### 2.2 GA4 Configuration Tag

In GTM:
1. Tags → New → Google Analytics: GA4 Configuration
2. Measurement ID: `{{GA4 Measurement ID}}` (create a Constant variable)
3. Trigger: All Pages
4. Tag name: "GA4 - Configuration"

### 2.3 GTM variable for Measurement ID

Variables → User-Defined → New → Constant:
- Name: "GA4 Measurement ID"
- Value: `G-XXXXXXXXXX`

## Phase 3: Custom event tags

### 3.1 DataLayer push helper (frontend code)

```ts
// lib/analytics.ts
declare global {
  interface Window { dataLayer: Record<string, unknown>[]; }
}

export function trackEvent(event: string, params?: Record<string, string | number>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  }
}
```

### 3.2 Events to implement

| Event name | Where to fire | Parameters |
|-----------|--------------|------------|
| `contact_form_submit` | On successful form POST response | `{ form_type: 'contact' }` |
| `cv_download` | On CV PDF link click | `{ file_name: 'CV_2026.pdf' }` |
| `service_inquiry_click` | Services page CTA click | `{ service: string }` |

### 3.3 GTM Custom Event triggers

For each event, in GTM:
1. Triggers → New → Custom Event
2. Event name: `contact_form_submit` (exact match)
3. Create GA4 Event Tag: fires on that trigger, sends event to GA4

## Phase 4: Vercel Analytics

```tsx
// app/layout.tsx — add alongside GTM
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Add inside <body>:
<Analytics />
<SpeedInsights />
```

Enable in Vercel dashboard: Project → Analytics → Enable Web Analytics + Speed Insights.

## Phase 5: Google Search Console

```ts
// app/layout.tsx — root metadata export
export const metadata = {
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};
```

1. Go to https://search.google.com/search-console
2. Add property: URL prefix `https://brzezina.dev`
3. Choose "HTML tag" verification method
4. Copy token → set `NEXT_PUBLIC_GSC_VERIFICATION=<token>` in Vercel
5. Deploy → click Verify in Search Console
6. Submit sitemap: `https://brzezina.dev/sitemap.xml`

## Phase 6: Verification

### GTM Preview mode

1. GTM → Preview → Enter `https://brzezina.dev`
2. Verify "GA4 - Configuration" fires on page load
3. Navigate pages — verify pageview fires on each
4. Submit contact form — verify `contact_form_submit` fires
5. Click CV link — verify `cv_download` fires

### GA4 Realtime

1. GA4 → Reports → Realtime
2. Open site in another tab — should see active user
3. Trigger events — should appear in Realtime → Events

### Vercel Analytics

1. Vercel dashboard → project → Analytics
2. Visit the site — page view should appear within ~30 seconds

## Environment variables summary

| Variable | Value | Environments |
|----------|-------|-------------|
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | All |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | All |
| `NEXT_PUBLIC_GSC_VERIFICATION` | GSC token | Production |

Set via: `vercel env add NEXT_PUBLIC_GTM_ID production` (repeat for preview/development).
