import { cn } from '@/lib/utils.ts';
import { Font, fontStyles, FontStyleType, fontWeights } from '@/models/text.ts';
import React from 'react';

type FontStyleListProps = React.ComponentPropsWithoutRef<'div'> & {
  font: Font;
  previewText?: string;
};

const DEFAULT_PREVIEW_TEXT = 'Custom Lab 2 by MXlab, the best configurator for your graphic kits.';

export default function FontStyleList({
  className,
  font,
  previewText,
  ...props
}: FontStyleListProps) {
  return (
    <div className={cn(className)} {...props}>
      {Object.entries(font.styles)
        .filter(([_, style]) => style !== null)
        .sort(([a], [b]) => {
          return Number(fontWeights[a as FontStyleType]) < Number(fontWeights[b as FontStyleType])
            ? -1
            : 1;
        })
        .map(([styleKey, style]) => (
          <div key={styleKey} className="border-b py-3 first:border-t">
            <div className="mb-2 text-sm">
              {fontStyles[styleKey as FontStyleType]} {fontWeights[styleKey as FontStyleType]}
            </div>
            <div
              style={{
                fontFamily: font.name,
                fontWeight: style?.weight || 'normal',
                fontStyle: style?.style || 'normal',
              }}
              className="text-2xl"
            >
              {previewText || DEFAULT_PREVIEW_TEXT}
            </div>
          </div>
        ))}
    </div>
  );
}
