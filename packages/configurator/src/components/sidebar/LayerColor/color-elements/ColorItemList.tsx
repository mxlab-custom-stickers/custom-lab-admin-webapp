import ColorPicker from '@/components/ColorPicker.tsx';
import ColorSwatch from '@/components/ColorSwatch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion.tsx';
import { type Color, type ColorItem } from '@clab/types';

type ColorItemListProps = {
  className?: string;
  colorItems: ColorItem[];
  onColorItemColorChange: (colorItem: ColorItem, color: Color) => void;
  config: {
    availableColors: Color[];
    columns?: number;
    space?: number;
  };
};

export default function ColorItemList({
  className,
  colorItems,
  onColorItemColorChange,
  config: { availableColors, columns = 5, space = 2 },
}: ColorItemListProps) {
  // Open the accordion item by default if there's only one color item
  const defaultValue = colorItems.length === 1 ? colorItems[0].id : undefined;

  return (
    <Accordion className={className} type="single" defaultValue={defaultValue} collapsible>
      {colorItems
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((colorItem) => (
          <AccordionItem key={colorItem.id} value={colorItem.id}>
            <AccordionTrigger className="items-center p-3">
              <div className="flex items-center gap-2">
                <ColorSwatch color={colorItem.color} />
                <div className="flex-1 text-base">{colorItem.name}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ColorPicker
                className="p-3"
                colors={availableColors}
                columns={columns}
                space={space}
                value={colorItem.color}
                onValueChange={(color) => onColorItemColorChange(colorItem, color)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}
