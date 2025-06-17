import ColorGroupCard from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorGroupCard.tsx';
import ColorItemCard from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorItemCard.tsx';
import ColorItemsAccordion from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorItemsAccordion.tsx';
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
  // Check if all color elements are of type 'item'
  const isAllColorItems = colorElements.every((colorElement) => colorElement.type === 'item');

  return isAllColorItems ? (
    <ColorItemsAccordion colorItems={colorElements} />
  ) : (
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
