import ColorElementList from '@/components/Sidebar/LayerColor/color-elements/ColorElementList.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { cn } from '@clab/utils';
import React from 'react';

type ColorGroupComponentProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorGroupComponent({ className, ...props }: ColorGroupComponentProps) {
  const { currentColorElement, setCurrentColorElementId } = useConfiguratorContext();

  const colorGroup = currentColorElement?.type === 'group' ? currentColorElement : null;

  return colorGroup ? (
    <div className={cn(className)} {...props}>
      <div className="px-1 text-lg">{colorGroup.name}</div>

      <ColorElementList
        colorElements={colorGroup.subColorElements}
        onColorElementClick={(colorElement) => setCurrentColorElementId(colorElement.id)}
      />
    </div>
  ) : null;
}
