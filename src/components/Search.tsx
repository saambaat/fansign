import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Input } from '@/components/ui/input';
import type { Lang } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { headingFor, monthName, resolveText, type Moment } from '@/lib/moments';

export default function Search({ moments, lang }: { moments: Moment[]; lang: Lang }) {
  const [query, setQuery] = useState('');
  const t = useTranslations(lang);

  const fuse = useMemo(
    () =>
      new Fuse(
        moments.map((moment) => ({
          id: moment.id,
          heading: headingFor(moment, lang),
          event: resolveText(moment.event, lang) ?? '',
          date: moment.date,
          month: monthName(moment.date.slice(0, 7), lang),
          tags: moment.tags ?? [],
        })),
        {
          keys: ['heading', 'event', 'date', 'month', 'tags'],
          threshold: 0.35,
          ignoreLocation: true,
        },
      ),
    [moments, lang],
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
      placeholder={t('search.placeholder')}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      className="h-8 rounded-full"
    />
  );
}
