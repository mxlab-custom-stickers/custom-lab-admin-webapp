import ColorGroupCard from '@/components/configurator/ColorGroupCard.tsx';
import ColorItemCard from '@/components/configurator/ColorItemCard.tsx';
import { cn } from '@/lib/utils.ts';
import { ColorElement } from '@/models/template.ts';
import React from 'react';

type ColorElementListProps = React.ComponentPropsWithoutRef<'div'> & {
  colorElements: ColorElement[];
  onColorElementClick?: (colorElement: ColorElement) => void;
};

export default function ColorElementList({
  className,
  colorElements,
  onColorElementClick,
  ...props
}: ColorElementListProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {colorElements
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((colorElement) =>
          colorElement.type === 'group' ? (
            <ColorGroupCard
              key={colorElement.id}
              colorGroup={colorElement}
              onClick={() => onColorElementClick?.(colorElement)}
            />
          ) : colorElement.type === 'item' ? (
            <ColorItemCard
              key={colorElement.id}
              colorItem={colorElement}
              onClick={() => onColorElementClick?.(colorElement)}
            />
          ) : null
        )}
    </div>
  );
}
