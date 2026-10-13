import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getMessages } from "next-intl/server";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeRegistry } from "@/app/ThemeRegistry";
import { ConsentBanner, ConsentProvider } from "@/components/consent";
import { SkipLink } from "@/components/nav/SkipLink";
import { themeInitScript } from "@/app/themeScript";
import "@/styles/tokens.css";
import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Václav Brzezina — Senior Full-Stack TypeScript Engineer",
  description:
    "Senior full-stack TypeScript/React engineer based in the Czech Republic. 9 years building JavaScript products. Available for freelance and contract work.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
