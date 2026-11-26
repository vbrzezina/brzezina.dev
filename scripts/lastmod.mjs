/**
 * Keeps src/data/lastModified.json in step with each page's content, so the sitemap's <lastmod> changes
 * only when a page's copy or data does, not on every deploy.
 *
 * Each page has a fingerprint (a hash of its messages and data files). When the fingerprint changes, the
 * page's date moves to today. Run by the pre-commit hook; src/lib/lastModified.test.ts fails CI when the
 * file is out of date (e.g. a commit made with --no-verify).
 *
 *   node scripts/lastmod.mjs          update the file
 *   node scripts/lastmod.mjs --check  exit 1 if it is out of date
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = 'src/data/lastModified.json';
const LOCALES = ['en', 'cs'];

const read = (file) => readFileSync(path.join(ROOT, file), 'utf8');
const messages = (locale) => JSON.parse(read(`messages/${locale}.json`));
const dataFiles = () =>
  readdirSync(path.join(ROOT, 'src/data'))
    .filter((name) => name.endsWith('.ts'))
    .sort()
    .map((name) => `src/data/${name}`);

/** What each sitemap path is built from. Keys match the paths in src/app/sitemap.ts. */
const PAGES = {
  // Everything but the privacy policy's own copy.
  '': () => [
    ...LOCALES.map((locale) => {
      const { privacy: _privacy, ...rest } = messages(locale);
      return JSON.stringify(rest);
    }),
    ...dataFiles().map(read),
  ],
  // The policy's copy, plus the business identity it shows (src/data/site.ts).
  '/privacy': () => [...LOCALES.map((locale) => JSON.stringify(messages(locale).privacy)), read('src/data/site.ts')],
};

const fingerprint = (parts) => createHash('sha256').update(parts.join('\0')).digest('hex').slice(0, 16);

export function readLastModified() {
  return JSON.parse(read(OUTPUT));
}

/** Paths whose stored fingerprint no longer matches their content. */
export function stalePaths(stored = readLastModified()) {
  return Object.entries(PAGES)
    .filter(([page, inputs]) => stored[page]?.fingerprint !== fingerprint(inputs()))
    .map(([page]) => page);
}

function update() {
  const stored = readLastModified();
  const stale = stalePaths(stored);
  if (stale.length === 0) return;

  const today = new Date().toISOString().slice(0, 10);
  for (const page of stale) stored[page] = { date: today, fingerprint: fingerprint(PAGES[page]()) };
  writeFileSync(path.join(ROOT, OUTPUT), `${JSON.stringify(stored, null, 2)}\n`);
  console.log(`lastmod: ${stale.map((page) => page || '/').join(', ')} → ${today}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--check')) {
    const stale = stalePaths();
    if (stale.length > 0) {
      console.error(`${OUTPUT} is out of date for: ${stale.map((page) => page || '/').join(', ')}`);
      console.error('Run `node scripts/lastmod.mjs` and commit the result.');
      process.exit(1);
    }
  } else {
    update();
  }
}
