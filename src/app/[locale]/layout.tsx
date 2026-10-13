import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeRegistry } from "@/app/ThemeRegistry";
import { ConsentBanner, ConsentProvider } from "@/components/consent";
import { SkipLink } from "@/components/nav/SkipLink";
import { themeInitScript } from "@/app/themeScript";
import { routing } from "@/i18n/routing";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import "@/styles/tokens.css";
import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(site.url),
    ...pageMetadata({ locale, title: t("title"), description: t("description") }),
  };
}

// Both locales are known at build time: pre-render them (and the pages below them) as static HTML.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // The middleware skips paths containing a dot (static files), so `/foo.bar` lands here with
  // locale "foo.bar". Without this check it rendered the home page with a 200 and lang="foo.bar".
  if (!hasLocale(routing.locales, locale)) notFound();
  // Without this next-intl reads the locale from request headers, which makes every route dynamic.
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Reveal blocks start transparent and fade in once scripts run; without JS they must just show. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important;animation:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <ThemeRegistry>
          <NextIntlClientProvider messages={messages}>
            <ConsentProvider>
              <SkipLink />
              {/* Early in the DOM so keyboard users reach the banner before the page. */}
              <ConsentBanner />
              {children}
            </ConsentProvider>
          </NextIntlClientProvider>
        </ThemeRegistry>
        {/* Cookieless and aggregate — no consent needed. Both are active only on Vercel. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
