import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Color, ColorPalette } from '@/models/color.ts';
import ColorSelector from '../colors/ColorSelector';

type TemplateLayerColorFormProps = {
  allColors: Color[];
  allColorPalettes: ColorPalette[];
};

export default function TemplateLayerColorForm({
  allColors,
  allColorPalettes,
}: TemplateLayerColorFormProps) {
  return (
    <form className="flex flex-col gap-3 [&_input]:bg-white [&_label]:mb-2">
      <div>
        <Label>Nom du calque</Label>
        <Input />
      </div>

      <div>
        <Label>Couleurs</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" className="w-full" variant="outline">
              Sélectionner les couleurs
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            sideOffset={18}
            className="w-full"
          >
            <ColorSelector
              allColors={allColors}
              allColorPalettes={allColorPalettes}
            />
          </PopoverContent>
        </Popover>
      </div>
    </form>
  );
}
