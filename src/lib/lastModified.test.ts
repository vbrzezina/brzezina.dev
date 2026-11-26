import { describe, expect, it } from 'vitest';
import { stalePaths } from '../../scripts/lastmod.mjs';

describe('src/data/lastModified.json', () => {
  // The pre-commit hook keeps it current; this catches commits that skipped the hook.
  it('matches the current content of every page (run `node scripts/lastmod.mjs` if this fails)', () => {
    expect(stalePaths()).toEqual([]);
  });
});
