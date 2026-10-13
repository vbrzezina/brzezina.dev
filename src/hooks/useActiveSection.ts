'use client';

import { useEffect, useState } from 'react';

/** Reading line, as a fraction of viewport height from the top. */
const READING_LINE = 0.35;

/**
 * Returns the id of the section that the reading line currently passes through,
 * or '' while it is above the first section (e.g. on the hero). At the very bottom
 * of the page the last section wins, so a short final section can still activate.
 * Ids not present in the document are ignored.
 *
 * Geometry-based rather than intersection-ratio-based: ratios are relative to each
 * section's own height and only update at thresholds, which made tall sections
 * lose to short ones at boundaries. Pass a stable (module-level) array.
 */
export function useActiveSection(sectionIds: readonly string[]): string {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (sectionIds.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      // Only sections rendered on this page count — content pages have none, so nothing activates.
      const present = sectionIds.filter((id) => document.getElementById(id));

      let current = '';
      for (const id of present) {
        if (document.getElementById(id)!.getBoundingClientRect().top <= line) current = id;
      }
      if (atBottom && present.length > 0) current = present[present.length - 1];

      setActiveId(current);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return activeId;
}
