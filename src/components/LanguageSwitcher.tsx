import { LanguagesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages, type Lang } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';

interface Props {
  lang: Lang;
  urls: Record<Lang, string>;
}

export default function LanguageSwitcher({ lang, urls }: Props) {
  const t = useTranslations(lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon" aria-label={t('lang.toggle')} />}
      >
        <LanguagesIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(languages) as Lang[]).map((code) => (
          <DropdownMenuItem
            key={code}
            render={<a href={urls[code]} hrefLang={code} />}
            aria-current={code === lang ? 'page' : undefined}
          >
            {languages[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
