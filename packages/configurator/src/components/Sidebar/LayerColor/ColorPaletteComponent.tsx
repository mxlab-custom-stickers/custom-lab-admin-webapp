import ColorPicker from '@/components/ColorPicker.tsx';
import ColorSwatch from '@/components/ColorSwatch.tsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { type Color, isTemplateLayerColor } from '@clab/types';
import {
  getColorItemsByColor,
  getUniqueColorsFromLayer,
  updateColorItemsInLayer,
} from '@clab/utils';
import { useMemo } from 'react';

export default function ColorPaletteComponent() {
  const { currentLayer, currentColorElement, updateLayer } = useConfiguratorContext();

  const { setColorItemsColor } = useCanvas();

  if (
    !currentLayer ||
    !isTemplateLayerColor(currentLayer) ||
    !(currentColorElement?.type === 'color-palette')
  ) {
    return null;
  }

  const colors = useMemo(
    () => getUniqueColorsFromLayer(currentLayer),
    [currentLayer.colorElements]
  );

  function handleColorSelect(oldColor: Color, newColor: Color) {
    if (!currentLayer || !isTemplateLayerColor(currentLayer)) return;

    // Getting all color items that match the old color
    const colorItemsToUpdate = getColorItemsByColor(currentLayer, oldColor.value);
    // Updating their color to the new color
    const updatedColorItems = colorItemsToUpdate.map((item) => ({
      ...item,
      color: newColor,
    }));
    // Change their color in the canvas
    setColorItemsColor(updatedColorItems);

    const updatedLayer = updateColorItemsInLayer(currentLayer, updatedColorItems);
    updateLayer(updatedLayer);
  }

  return (
    <div className="mt-1">
      <div className="text-muted-foreground mb-1 text-sm">
        Modifie en une seule fois toutes les mêmes couleurs
      </div>

      <Accordion type="single" collapsible>
        {colors.map((color, index) => (
          <AccordionItem key={color.id || color.value} value={`color-${index}`}>
            <AccordionTrigger className="items-center">
              <div className="flex items-center">
                <ColorSwatch className="mr-2" color={color} />
                {color.name || `Couleur ${index + 1}`}
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <ColorPicker
                className="p-1"
                colors={currentLayer.config.availableColors}
                columns={currentLayer.config.columns}
                space={currentLayer.config.space}
                value={color}
                onValueChange={(newColor) => handleColorSelect(color, newColor)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
