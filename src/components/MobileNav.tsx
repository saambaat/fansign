import { CalendarIcon, HomeIcon, PanelLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from 'cn';
import type { Lang } from '@/i18n/ui';
import { localePath, useTranslations } from '@/i18n/utils';

interface Props {
  years: string[];
  activeYear?: string;
  lang: Lang;
}

const itemClass =
  'flex w-fit items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-sidebar-accent aria-[current=page]:bg-sidebar-accent aria-[current=page]:font-medium';

export default function MobileNav({ years, activeYear, lang }: Props) {
  const t = useTranslations(lang);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t('nav.toggleMenu')} />
        }
      >
        <PanelLeftIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>{t('nav.menu')}</SheetTitle>
        </SheetHeader>
        <nav aria-label={t('nav.site')} className="flex flex-col gap-1 px-4 pb-4">
          <a
            href={localePath(lang, '/')}
            aria-current={activeYear ? undefined : 'page'}
            className={itemClass}
          >
            <HomeIcon className="size-4" />
            <span>{t('nav.home')}</span>
          </a>
          {years.length > 0 && (
            <>
              <p className="mt-4 mb-1 flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span>{t('nav.years')}</span>
              </p>
              {years.map((year) => (
                <a
                  key={year}
                  href={localePath(lang, `/${year}`)}
                  aria-current={activeYear === year ? 'page' : undefined}
                  className={cn(itemClass, 'ml-6')}
                >
                  <span>{year}</span>
                </a>
              ))}
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
