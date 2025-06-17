import ColorSwatch from '@/components/colors/ColorSwatch.tsx';
import SidebarCard from '@/components/configurator/ConfiguratorSidebar/SidebarCard.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { compareColorsByLuminance } from '@/lib/colors.ts';
import { getUniqueColorsFromLayer } from '@/lib/configurator.ts';
import { isTemplateLayerColor } from '@/models/template.ts';
import { useMemo } from 'react';

/**
 * A section displaying a clickable color palette card with a preview of
 * the unique colors from the current color layer.
 *
 * When clicked, it triggers navigation to the full color palette view by
 * setting the current color element id to 'color-palette'.
 *
 * If the current layer does not support color palettes, it renders nothing.
 */
export function ColorPaletteSection() {
  const { currentLayer, setCurrentColorElementId } = useConfiguratorContext();

  if (!currentLayer || !isTemplateLayerColor(currentLayer)) return null;

  const colors = useMemo(
    () => getUniqueColorsFromLayer(currentLayer).sort(compareColorsByLuminance),
    [currentLayer.colorElements]
  );

  return currentLayer.config.enableColorPalette ? (
    <div>
      <SidebarCard onClick={() => setCurrentColorElementId('color-palette')}>
        <div className="text-sm font-semibold">Palette de couleurs</div>
        <div className="text-muted-foreground mb-2 text-xs">Change toutes les mêmes couleurs</div>
        <div className="flex flex-wrap items-center gap-1.5">
          {colors.map((color, index) => (
            <ColorSwatch
              key={color.id ? `${color.id}-${index}` : index}
              className="h-9 w-9"
              color={color}
            />
          ))}
        </div>
      </SidebarCard>

      <div className="my-2 grid grid-cols-[40%_20%_40%] items-center px-3">
        <Separator />
        <span className="text-center text-sm font-medium">ou</span>
        <Separator />
      </div>

      <div className="text-muted-foreground p-2 text-xs">Modifie les couleurs par éléments</div>
    </div>
  ) : null;
}
