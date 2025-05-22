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
import { cn } from '@/lib/utils.ts';
import { Color, ColorPalette } from '@/models/color.ts';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type ColorSelectorProps = React.ComponentPropsWithoutRef<'div'> & {
  colorPalettes: ColorPalette[];
  colors: Color[];

  selectedColorPalettes?: ColorPalette[];
  selectedColors?: Color[];

  onChange?: ({
    colorPalettes,
    colors,
  }: {
    colorPalettes: ColorPalette[];
    colors: Color[];
  }) => void;
};

export default function ColorSelector({
  className,
  colorPalettes,
  colors,
  selectedColorPalettes: selectedColorPalettesProp,
  selectedColors: selectedColorsProp,
  onChange,
  ...props
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
    let changes: ColorPalette[] = [];

    if (selectedColorPalettes.find((p) => p.id === colorPalette.id)) {
      changes = selectedColorPalettes.filter((p) => p.id !== colorPalette.id);
    } else {
      changes = [...selectedColorPalettes, colorPalette];
    }

    setSelectedColorPalettes(changes);
    onChange?.({ colorPalettes: changes, colors: selectedColors });
  }

  function handleColorSelect(color: Color) {
    let changes: Color[] = [];

    if (selectedColors.find((c) => c.id === color.id)) {
      changes = selectedColors.filter((p) => p.id !== color.id);
    } else {
      changes = [...selectedColors, color];
    }

    setSelectedColors(changes);
    onChange?.({ colorPalettes: selectedColorPalettes, colors: changes });
  }

  return (
    <div className={cn(className)} {...props}>
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
            {colorPalettes.map((colorPalette) => (
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

          {colorPalettes.length === 0 ? (
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
            {colors.sort(compareColorsByLuminance).map((color) => (
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

          {colors.length === 0 ? <div>Aucune couleur enregistrée</div> : null}

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
