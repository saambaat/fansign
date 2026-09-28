import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Input } from '@/components/ui/input';
import { headingFor, type Moment } from '@/lib/moments';

export default function Search({ moments }: { moments: Moment[] }) {
  const [query, setQuery] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(
        moments.map((moment) => ({
          id: moment.id,
          heading: headingFor(moment),
          event: moment.event ?? '',
          date: moment.date,
          tags: moment.tags ?? [],
        })),
        {
          keys: ['heading', 'event', 'date', 'tags'],
          threshold: 0.35,
          ignoreLocation: true,
        },
      ),
    [moments],
  );

  useEffect(() => {
    const value = query.trim();
    const ids = value ? new Set(fuse.search(value).map((result) => result.item.id)) : null;

    let visible = 0;
    document.querySelectorAll<HTMLElement>('[data-moment-id]').forEach((card) => {
      const show = ids === null || ids.has(card.dataset.momentId ?? '');
      card.hidden = !show;
      if (show) visible += 1;
    });

    document.querySelectorAll<HTMLElement>('[data-month-section]').forEach((section) => {
      const hasVisible = section.querySelectorAll('[data-moment-id]:not([hidden])').length > 0;
      section.hidden = !hasVisible;
      if (section.id) {
        const item = document.querySelector<HTMLElement>(`[data-month-link="${section.id}"]`);
        if (item) item.hidden = !hasVisible;
      }
    });

    document.querySelectorAll<HTMLElement>('[data-year-section]').forEach((section) => {
      const hasVisible = section.querySelectorAll('[data-moment-id]:not([hidden])').length > 0;
      section.hidden = !hasVisible;
    });

    const empty = document.querySelector<HTMLElement>('[data-empty-state]');
    if (empty) {
      empty.hidden = visible !== 0;
    }
  }, [query, fuse]);

  return (
    <Input
      type="search"
      placeholder="Search"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      className="h-8 rounded-full"
    />
  );
}
