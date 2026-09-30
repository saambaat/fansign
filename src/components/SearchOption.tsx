import type { SearchHit } from '../lib/search';

interface Props {
  hit: SearchHit;
  active?: boolean;
  compact?: boolean;
  option?: boolean;
  optionRef?: (node: HTMLAnchorElement | null) => void;
}

export const searchOptionId = (hit: SearchHit): string =>
  `search-option-${hit.doc.type}-${hit.doc.id}`;

export default function SearchOption({
  hit,
  active = false,
  compact = true,
  option = false,
  optionRef,
}: Props) {
  const { doc } = hit;
  const secondary = compact ? (doc.subtitle ?? doc.meta) : doc.subtitle;

  return (
    <a
      href={doc.href}
      ref={optionRef}
      role={option ? 'option' : undefined}
      aria-selected={option ? active : undefined}
      id={option ? searchOptionId(hit) : undefined}
      tabIndex={option ? -1 : undefined}
      className={`flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors ${
        active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60'
      }`}
    >
      <img
        src={doc.poster}
        alt=""
        loading="lazy"
        className={`${compact ? 'size-10' : 'size-14'} flex-none rounded-md bg-black object-cover`}
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{doc.title}</span>
        {secondary && (
          <span className="block truncate text-xs text-muted-foreground">{secondary}</span>
        )}
        {!compact && doc.meta && (
          <span className="block truncate text-xs text-muted-foreground">{doc.meta}</span>
        )}
      </span>
    </a>
  );
}
