import { countAvailableFontStyles } from '@/lib/fonts.ts';
import { cn } from '@/lib/utils.ts';
import { Font } from '@/models/text.ts';
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
          <div key={font.id} className="rounded border-b pt-4">
            <div className="px-2 text-sm">
              <span className="mr-2 font-semibold">{font.name}</span>{' '}
              <FontStylesCount font={font} />
            </div>
            <div
              className="line-clamp-1 px-2 text-4xl leading-18"
              style={{ fontFamily: font.name }}
            >
              Custom Lab 2 by MXlab, the best configurator for your graphic
              kits.
            </div>
          </div>
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
