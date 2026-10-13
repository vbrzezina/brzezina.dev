import { notFound } from 'next/navigation';

// Unknown paths under a valid locale (/en/nope). Without a catch-all they reach Next's generic,
// unbranded 404 page; calling notFound() here renders [locale]/not-found.tsx inside the locale layout.
export default function CatchAll() {
  notFound();
}
