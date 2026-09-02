'use client';

import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '');

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the entry with the highest intersectionRatio among intersecting entries
      let best: IntersectionObserverEntry | null = null;

      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (best === null || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      }

      if (best !== null) {
        setActiveId((best.target as HTMLElement).id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-30% 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 1],
    });

    const elements: HTMLElement[] = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeId;
}
