import ColorChip from '@/components/colors/ColorChip.tsx';
import ColorPicker from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorPicker.tsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { Color } from '@/models/color.ts';
import { ColorItem } from '@/models/template.ts';

type ColorItemsAccordionProps = {
  colorItems: ColorItem[];
};

export default function ColorItemsAccordion({
  colorItems,
}: ColorItemsAccordionProps) {
  const {
    state: { canvas },
    currentLayer,
    updateColorElement,
  } = useConfiguratorContext();
  if (!currentLayer || currentLayer.type !== 'color') return null;

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
    <Accordion type="single" collapsible>
      {colorItems
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((colorItem) => (
          <AccordionItem key={colorItem.id} value={colorItem.id}>
            <AccordionTrigger className="items-center px-1 py-0">
              <div className="flex items-center">
                <ColorChip className="mr-2" color={colorItem.color} />
                <div
                  className="flex h-14 flex-1 items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <InvisibleInput
                    className="w-full"
                    value={colorItem.name}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                    onSubmit={(name) => {
                      updateColorElement({ ...colorItem, name });
                    }}
                  />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ColorPicker
                className="p-1"
                colors={currentLayer.config.availableColors}
                columns={currentLayer.config.columns}
                space={currentLayer.config.space}
                selectedColor={colorItem.color}
                onSelectColor={(color) => handleColorSelect(colorItem, color)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}
