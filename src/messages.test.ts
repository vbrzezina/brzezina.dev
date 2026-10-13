import { describe, expect, it } from 'vitest';
import cs from '../messages/cs.json';
import en from '../messages/en.json';

type Node = string | string[] | { [key: string]: Node } | Node[];

/** Every leaf as `path → string`, arrays addressed by index. */
function flatten(node: Node, prefix = '', out: Record<string, string> = {}): Record<string, string> {
  if (typeof node === 'string') out[prefix] = node;
  else if (Array.isArray(node)) node.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
  else for (const [key, value] of Object.entries(node)) flatten(value, prefix ? `${prefix}.${key}` : key, out);
  return out;
}

const enFlat = flatten(en as Node);
const csFlat = flatten(cs as Node);

/** ICU placeholders `{name}` and rich-text tags `<link>`/`</link>`, sorted, for comparison. */
const tokens = (text: string) => [...(text.match(/\{[^}]+\}|<\/?[a-z]+>/gi) ?? [])].sort();

describe('messages', () => {
  it('has the same keys in English and Czech', () => {
    expect(Object.keys(csFlat).sort()).toEqual(Object.keys(enFlat).sort());
  });

  it('has no empty strings', () => {
    for (const [path, text] of [...Object.entries(enFlat), ...Object.entries(csFlat)]) {
      expect(text.trim(), path).not.toBe('');
    }
  });

  it('uses the same placeholders and rich-text tags in both languages', () => {
    for (const path of Object.keys(enFlat)) {
      expect(tokens(csFlat[path] ?? ''), path).toEqual(tokens(enFlat[path]));
    }
  });
});
