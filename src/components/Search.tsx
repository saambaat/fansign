import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Input } from '@/components/ui/input';
import type { Lang } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { headingFor } from '@/lib/moment-display';
import { resolveText, type Moment, type Pairing } from '@/lib/moment-schema';
import { monthName } from '@/lib/months';
import { resolvePairing } from '@/lib/pairings';

interface Props {
  moments?: Moment[];
  pairings?: Pairing[];
  lang: Lang;
}

interface SearchDoc {
  id: string;
  [key: string]: unknown;
}

export default function Search({ moments = [], pairings = [], lang }: Props) {
  const [query, setQuery] = useState('');
  const t = useTranslations(lang);
  const pairingMode = pairings.length > 0;

  const fuse = useMemo(() => {
    const docs: SearchDoc[] = pairingMode
      ? pairings.map((id) => {
          const pairing = resolvePairing(id, lang);
          return {
            id,
            name: pairing.name,
            members: pairing.memberAliases.join(' '),
            description: pairing.description ?? '',
          };
        })
      : moments.map((moment) => {
          const pairing = resolvePairing(moment.pairing, lang);
          return {
            id: moment.id,
            pairing: [moment.pairing, pairing.name].join(' '),
            members: pairing.memberAliases.join(' '),
            momentType: moment.momentType,
            heading: headingFor(moment, lang),
            event: resolveText(moment.event, lang) ?? '',
            date: moment.date,
            month: monthName(moment.date.slice(0, 7), lang),
            tags: moment.tags ?? [],
          };
        });
    const keys = pairingMode
      ? ['name', 'members', 'description']
      : ['heading', 'event', 'pairing', 'members', 'momentType', 'date', 'month', 'tags'];
    return new Fuse(docs, { keys, threshold: 0.35, ignoreLocation: true });
  }, [moments, pairings, pairingMode, lang]);

  useEffect(() => {
    const value = query.trim();
    const ids = value ? new Set(fuse.search(value).map((result) => result.item.id)) : null;

    let visible = 0;
    document
      .querySelectorAll<HTMLElement>(pairingMode ? '[data-pairing-id]' : '[data-moment-id]')
      .forEach((card) => {
        const id = pairingMode ? card.dataset.pairingId : card.dataset.momentId;
        const show = ids === null || ids.has(id ?? '');
        card.hidden = !show;
        if (show) visible += 1;
      });

    if (!pairingMode) {
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
    }

    const empty = document.querySelector<HTMLElement>('[data-empty-state]');
    if (empty) {
      empty.hidden = visible !== 0;
    }
  }, [query, fuse, pairingMode]);

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
