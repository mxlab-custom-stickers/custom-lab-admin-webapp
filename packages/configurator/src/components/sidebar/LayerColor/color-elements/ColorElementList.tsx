import ColorElementCard from '@/components/sidebar/LayerColor/color-elements/ColorElementCard.tsx';
import { type ColorElement } from '@clab/types';
import { cn } from '@clab/utils';
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
    <div className={cn('flex flex-col pb-2', className)} {...props}>
      {colorElements
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((colorElement) => (
          <ColorElementCard
            key={colorElement.id}
            colorElement={colorElement}
            onClick={() => onColorElementClick?.(colorElement)}
          />
        ))}
    </div>
  );
}
