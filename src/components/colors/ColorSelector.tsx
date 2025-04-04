import ColorChip from '@/components/colors/ColorChip.tsx';
import ColorPaletteCard from '@/components/colors/ColorPaletteCard.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx';
import { compareColorsByLuminance } from '@/lib/colors.ts';
import { Color, ColorPalette } from '@/models/color.ts';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

type ColorSelectorProps = {
  allColorPalettes: ColorPalette[];
  allColors: Color[];

  selectedColorPalettes?: ColorPalette[];
  selectedColors?: Color[];
};

export default function ColorSelector({
  allColorPalettes,
  allColors,
  selectedColorPalettes: selectedColorPalettesProp,
  selectedColors: selectedColorsProp,
}: ColorSelectorProps) {
  const [selectedColorPalettes, setSelectedColorPalettes] = useState<
    ColorPalette[]
  >([]);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);

  useEffect(() => {
    if (selectedColorPalettesProp !== undefined) {
      setSelectedColorPalettes(selectedColorPalettesProp);
    }
  }, [selectedColorPalettesProp]);

  useEffect(() => {
    if (selectedColorsProp !== undefined) {
      setSelectedColors(selectedColorsProp);
    }
  }, [selectedColorsProp]);

  function handleColorPaletteSelect(colorPalette: ColorPalette) {
    if (selectedColorPalettes.find((p) => p.id === colorPalette.id)) {
      setSelectedColorPalettes(
        selectedColorPalettes.filter((p) => p.id !== colorPalette.id)
      );
    } else {
      setSelectedColorPalettes([...selectedColorPalettes, colorPalette]);
    }
  }

  function handleColorSelect(color: Color) {
    if (selectedColors.find((c) => c.id === color.id)) {
      setSelectedColors(selectedColors.filter((c) => c.id !== color.id));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  }

  return (
    <div className="w-[500px]">
      <Tabs defaultValue="palettes" className="gap-4">
        <TabsList className="w-full">
          <TabsTrigger value="palettes">
            Palettes{' '}
            {selectedColorPalettes.length
              ? `(${selectedColorPalettes.length})`
              : null}
          </TabsTrigger>

          <TabsTrigger value="colors">
            Couleurs{' '}
            {selectedColors.length ? `(${selectedColors.length})` : null}
          </TabsTrigger>
        </TabsList>

        {/* Palettes */}
        <TabsContent value="palettes">
          <div className="grid grid-cols-2 gap-2">
            {allColorPalettes.map((colorPalette) => (
              <ColorPaletteCard
                key={colorPalette.id}
                colorPalette={colorPalette}
                onClick={() => handleColorPaletteSelect(colorPalette)}
                selectable
                selected={
                  !!selectedColorPalettes.find(
                    (cp) => cp.id === colorPalette.id
                  )
                }
              />
            ))}
          </div>

          {allColorPalettes.length === 0 ? (
            <div>Aucune palette de couleur enregistrée</div>
          ) : null}

          <div className="mt-4 flex justify-end">
            <Button>
              <Plus />
              Nouvelle palette
            </Button>
          </div>
        </TabsContent>

        {/* Colors */}
        <TabsContent value="colors">
          <div className="grid grid-cols-10 gap-3">
            {allColors.sort(compareColorsByLuminance).map((color) => (
              <ColorChip
                key={color.id}
                className="w-full"
                color={color}
                onClick={() => handleColorSelect(color)}
                selectable
                selected={!!selectedColors.find((c) => c.id === color.id)}
              />
            ))}
          </div>

          {allColors.length === 0 ? (
            <div>Aucune couleur enregistrée</div>
          ) : null}

          <div className="mt-4 flex justify-end">
            <Button>
              <Plus />
              Nouvelle couleur
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
