import ColorElementList from '@/components/sidebar/LayerColor/color-elements/ColorElementList.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { cn } from '@clab/utils';
import React from 'react';

type ColorGroupComponentProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorGroupComponent({ className, ...props }: ColorGroupComponentProps) {
  const { selectedColorElement, setSelectedColorElementId } = useConfiguratorContext();

  const colorGroup = selectedColorElement?.type === 'group' ? selectedColorElement : null;

  return colorGroup ? (
    <div className={cn(className)} {...props}>
      <ColorElementList
        colorElements={colorGroup.subColorElements}
        onColorElementClick={(colorElement) => setSelectedColorElementId(colorElement.id)}
      />
    </div>
  ) : null;
}
