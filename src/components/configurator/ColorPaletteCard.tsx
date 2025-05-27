import ColorChip from '@/components/colors/ColorChip.tsx';
import SidebarCard from '@/components/configurator/SidebarCard.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { compareColorsByLuminance } from '@/lib/colors.ts';
import { getUniqueColorsFromLayer } from '@/lib/configurator.ts';
import { cn } from '@/lib/utils.ts';
import React, { useMemo } from 'react';

export default function ColorPaletteCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { currentLayer } = useConfiguratorContext();

  if (!currentLayer) return null;

  const colors = useMemo(
    () => getUniqueColorsFromLayer(currentLayer).sort(compareColorsByLuminance),
    [currentLayer.colorElements]
  );

  return (
    <SidebarCard className={cn(className)} {...props}>
      <div className="text-sm font-semibold">Palette de couleurs</div>
      <div className="text-muted-foreground mb-2 text-xs">
        Change toutes les mêmes couleurs
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {colors.map((color, index) => (
          <ColorChip
            key={color.id ? `${color.id}-${index}` : index}
            className="h-9 w-9"
            color={color}
          />
        ))}
      </div>
    </SidebarCard>
  );
}
