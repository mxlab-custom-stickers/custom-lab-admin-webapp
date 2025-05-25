import ColorChip from '@/components/colors/ColorChip.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import React from 'react';

type ColorItemComponentProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorItemComponent({
  className,
  ...props
}: ColorItemComponentProps) {
  const { currentColorElement } = useConfiguratorContext();

  const colorItem =
    currentColorElement?.type === 'item' ? currentColorElement : null;

  return colorItem ? (
    <div className={className} {...props}>
      <div className="mb-3 flex items-center gap-2">
        <InvisibleInput
          className="!text-lg font-semibold"
          value={colorItem.name}
        />
        <ColorChip className="shrink-0" color={colorItem.color} />
      </div>
    </div>
  ) : null;
}
