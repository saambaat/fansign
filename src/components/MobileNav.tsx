import { CalendarIcon, HomeIcon, PanelLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from 'cn';

interface Props {
  years: string[];
  activeYear?: string;
  base: string;
}

const itemClass =
  'flex w-fit items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-sidebar-accent aria-[current=page]:bg-sidebar-accent aria-[current=page]:font-medium';

export default function MobileNav({ years, activeYear, base }: Props) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle menu" />}
      >
        <PanelLeftIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Site" className="flex flex-col gap-1 px-4 pb-4">
          <a href={`${base}/`} aria-current={activeYear ? undefined : 'page'} className={itemClass}>
            <HomeIcon className="size-4" />
            <span>Home</span>
          </a>
          {years.length > 0 && (
            <>
              <p className="mt-4 mb-1 flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span>Years</span>
              </p>
              {years.map((year) => (
                <a
                  key={year}
                  href={`${base}/${year}/`}
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
