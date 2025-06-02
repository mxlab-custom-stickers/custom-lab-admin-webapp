import StatusBadge from '@/components/ui/StatusBadge.tsx';
import { countAvailableFontStyles } from '@/lib/fonts.ts';
import { cn } from '@/lib/utils.ts';
import { Font } from '@/models/text.ts';
import { Link } from '@tanstack/react-router';
import React from 'react';

type FontListProps = React.ComponentPropsWithoutRef<'div'> & {
  fonts: Font[];
};

export default function FontList({
  className,
  fonts,
  ...props
}: FontListProps) {
  return (
    <div className={cn(className)} {...props}>
      {fonts
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((font) => (
          <Link
            to="/fonts/$id"
            params={{ id: font.id }}
            key={font.id}
            className="block border-b pt-4 hover:rounded hover:bg-gray-200"
          >
            <div className="flex items-center gap-2 px-2 text-sm whitespace-nowrap">
              <span className="font-semibold">{font.name}</span>{' '}
              <FontStylesCount font={font} />
              <StatusBadge className="ml-auto" status={font.status} />
            </div>
            <div
              className="line-clamp-1 px-2 text-4xl leading-18"
              style={{ fontFamily: font.name }}
            >
              Custom Lab 2 by MXlab, the best configurator for your graphic
              kits.
            </div>
          </Link>
        ))}
    </div>
  );
}

function FontStylesCount({ font }: { font: Font }) {
  const count = countAvailableFontStyles(font);

  return count > 1 ? (
    <span className="text-muted-foreground">{count} styles</span>
  ) : null;
}
