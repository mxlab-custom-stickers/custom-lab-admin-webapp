import ColorElementList from '@/components/configurator/ColorElementList.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { cn } from '@/lib/utils';
import React from 'react';

type ColorGroupComponentProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorGroupComponent({
  className,
  ...props
}: ColorGroupComponentProps) {
  const { currentColorElement, setCurrentColorElementId } =
    useConfiguratorContext();

  const colorGroup =
    currentColorElement?.type === 'group' ? currentColorElement : null;

  return colorGroup ? (
    <div className={cn(className)} {...props}>
      <InvisibleInput
        className="mb-3 !text-lg font-semibold"
        value={colorGroup.name}
      />
      <ColorElementList
        colorElements={colorGroup.subColorElements}
        onColorElementClick={(colorElement) =>
          setCurrentColorElementId(colorElement.id)
        }
      />
    </div>
  ) : null;
}
