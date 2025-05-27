import ColorChip from '@/components/colors/ColorChip.tsx';
import ColorPicker from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorPicker.tsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import {
  getColorItemsByColor,
  getUniqueColorsFromLayer,
  updateColorItemsInLayer,
} from '@/lib/configurator.ts';
import { Color } from '@/models/color.ts';
import { useMemo } from 'react';

export default function ColorPalette() {
  const { currentLayer, currentColorElement, updateLayer } =
    useConfiguratorContext();

  if (
    !currentLayer ||
    currentLayer.type !== 'color' ||
    !(currentColorElement?.type === 'color-palette')
  ) {
    return null;
  }

  const colors = useMemo(
    () => getUniqueColorsFromLayer(currentLayer),
    [currentLayer.colorElements]
  );

  function handleColorSelect(oldColor: Color, newColor: Color) {
    if (!currentLayer || currentLayer.type !== 'color') return;

    const colorItemsToUpdate = getColorItemsByColor(
      currentLayer,
      oldColor.value
    );
    const updatedColorItems = colorItemsToUpdate.map((item) => ({
      ...item,
      color: newColor,
    }));
    const updatedLayer = updateColorItemsInLayer(
      currentLayer,
      updatedColorItems
    );

    updateLayer(updatedLayer);
  }

  return (
    <div className="mt-1">
      <div className="text-muted-foreground mb-1 text-xs">
        Modifie en une seule fois toutes les mêmes couleurs
      </div>
      <Accordion type="single" collapsible>
        {colors.map((color, index) => (
          <AccordionItem key={color.id || color.value} value={`color-${index}`}>
            <AccordionTrigger className="items-center">
              <div className="flex items-center">
                <ColorChip className="mr-2" color={color} />
                {color.name || `Couleur ${index + 1}`}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ColorPicker
                className="p-1"
                colors={currentLayer.config.availableColors}
                columns={currentLayer.config.columns}
                space={currentLayer.config.space}
                selectedColor={color}
                onSelectColor={(newColor) => handleColorSelect(color, newColor)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
