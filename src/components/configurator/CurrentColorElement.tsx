import ColorGroup from '@/components/configurator/ColorGroup.tsx';
import ColorItem from '@/components/configurator/ColorItem.tsx';
import ColorPalette from '@/components/configurator/ColorPalette.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { CurrentColorElementType } from '@/contexts/configurator/configurator-types.ts';
import { ReactNode } from 'react';

const currentColorElementComponents: Record<
  CurrentColorElementType,
  ReactNode
> = {
  group: <ColorGroup />,
  item: <ColorItem />,
  'color-palette': <ColorPalette />,
};

export default function CurrentColorElement() {
  const { currentColorElement } = useConfiguratorContext();

  return currentColorElement
    ? currentColorElementComponents[currentColorElement.type]
    : null;
}
