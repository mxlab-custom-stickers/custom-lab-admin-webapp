import ColorGroupCard from '@/components/Sidebar/LayerColor/color-elements/ColorGroupCard.tsx';
import ColorItemsAccordion from '@/components/Sidebar/LayerColor/color-elements/ColorItemsAccordion.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import type { ColorElement } from '@clab/types';
import { cn } from '@clab/utils';
import React from 'react';
import ColorItemCard from './ColorItemCard';

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
  // Check if all color elements are of type 'item'
  const isAllColorItems = colorElements.every((colorElement) => colorElement.type === 'item');

  return isAllColorItems ? (
    <ColorItemsAccordion colorItems={colorElements} />
  ) : (
    <div className={cn('flex flex-col pb-2', className)} {...props}>
      {colorElements
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((colorElement) =>
          colorElement.type === 'group' ? (
            <React.Fragment key={colorElement.id}>
              <ColorGroupCard
                colorGroup={colorElement}
                onClick={() => onColorElementClick?.(colorElement)}
              />
              <div className="mx-3">
                <Separator />
              </div>
            </React.Fragment>
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
