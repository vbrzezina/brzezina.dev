import type en from '../../messages/en.json';

/**
 * Types next-intl's `t()` from the English messages, so a missing or misspelled key is a compile error
 * instead of a blank string at runtime. (`src/messages.test.ts` keeps the Czech file in step with it.)
 */
declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof en;
    Locale: 'en' | 'cs';
  }
}
