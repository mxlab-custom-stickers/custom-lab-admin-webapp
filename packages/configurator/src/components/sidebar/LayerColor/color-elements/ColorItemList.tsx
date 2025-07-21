import ColorPicker from '@/components/ColorPicker.tsx';
import ColorSwatch from '@/components/ColorSwatch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { type Color, type ColorItem, isLayerColor } from '@clab/types';

type ColorItemListProps = {
  className?: string;
  colorItems: ColorItem[];
  onColorItemColorChange: (colorItem: ColorItem, color: Color) => void;
};

export default function ColorItemList({
  className,
  colorItems,
  onColorItemColorChange,
}: ColorItemListProps) {
  const {
    state: { canvas },
    currentLayer,
    updateColorElement,
  } = useConfiguratorContext();
  if (!currentLayer || !isLayerColor(currentLayer)) return null;

  function handleColorSelect(colorItem: ColorItem, color: Color) {
    if (canvas) {
      colorItem.fabricObjects?.forEach((obj) => {
        obj.set('fill', color.value);
      });
      canvas.requestRenderAll();
    }
    updateColorElement({ ...colorItem, color });
  }

  return (
    <Accordion className={className} type="single" collapsible>
      {colorItems
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((colorItem) => (
          <AccordionItem key={colorItem.id} value={colorItem.id}>
            <AccordionTrigger className="items-center px-1 py-0">
              <div className="flex items-center">
                <ColorSwatch className="mr-2" color={colorItem.color} />
                <div className="flex h-14 flex-1 items-center text-base">{colorItem.name}</div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <ColorPicker
                className="p-1"
                colors={currentLayer.config.availableColors}
                columns={currentLayer.config.columns}
                space={currentLayer.config.space}
                value={colorItem.color}
                onValueChange={(color) => onColorItemColorChange(colorItem, color)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}
