import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Label } from '@/components/ui/label.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { useControlledState } from '@/hooks/use-controlled-state.ts';
import { ColorSwatch } from '@clab/configurator';
import type { Color, ColorPalette } from '@clab/types';
import { arePaletteColorsAvailable, compareColorsByLuminance } from '@clab/utils';
import React from 'react';

type ColorSelectorProps = React.ComponentPropsWithoutRef<'div'> & {
  config: {
    palettes: ColorPalette[];
    colors: Color[];
  };
  value?: Color[];
  onValueChange?: (value: Color[]) => void;
};

export default function ColorSelector({
  className,
  value: valueProp,
  onValueChange,
  config: { palettes, colors },
  ...props
}: ColorSelectorProps) {
  const [value, setValue] = useControlledState<Color[]>(valueProp, onValueChange, []);

  function addPaletteSelect(palette: ColorPalette) {
    // Add all colors from the palette that are not already in the value
    const paletteColorsToAdd = palette.colors.filter(
      (color) => !value.some((c) => c.id === color.id)
    );
    setValue([...value, ...paletteColorsToAdd]);
  }

  function removePaletteSelect(palette: ColorPalette) {
    // Remove all colors from the palette from the value
    const newValue = value.filter(
      (color) => !palette.colors.some((paletteColor) => paletteColor.id === color.id)
    );
    setValue(newValue);
  }
  function handleColorSelect(color: Color) {
    const newValue = value.some((c) => c.id === color.id)
      ? value.filter((c) => c.id !== color.id)
      : [...value, color];

    setValue(newValue);
  }

  return (
    <div className={className} {...props}>
      <Tabs defaultValue="palettes" className="h-full">
        <TabsList className="mb-2">
          <TabsTrigger value="palettes">Palettes</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
        </TabsList>

        {/* Palettes */}
        <TabsContent value="palettes" className="h-full overflow-hidden">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="grid grid-cols-1 gap-8 px-1 pr-4">
              {palettes.map((palette) => (
                <div key={palette.id} className="flex flex-col">
                  <Label className="flex items-center hover:underline">
                    <div className="flex-1">
                      <div className="text-base font-semibold">{palette.name}</div>
                      <div className="text-muted-foreground text-sm">{palette.description}</div>
                    </div>
                    <Checkbox
                      className="h-5 w-5 [&_svg]:h-4 [&_svg]:w-4"
                      onCheckedChange={(checked) =>
                        checked ? addPaletteSelect(palette) : removePaletteSelect(palette)
                      }
                      checked={arePaletteColorsAvailable(palette, value)}
                    />
                  </Label>

                  <div className="mt-2 grid grid-cols-8 gap-2">
                    {palette.colors.sort(compareColorsByLuminance).map((color) => (
                      <div key={color.id}>
                        <ColorSwatch className="w-full" color={color} />
                        <div className="mt-1 line-clamp-2 text-center text-xs">{color.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Colors */}
        <TabsContent value="colors" className="h-full overflow-hidden">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="grid grid-cols-8 gap-2 p-1 pr-4">
              {colors.sort(compareColorsByLuminance).map((color) => (
                <div key={color.id}>
                  <ColorSwatch
                    color={color}
                    className="w-full"
                    selectable
                    selected={value.some((c) => c.id === color.id)}
                    onClick={() => handleColorSelect(color)}
                  />
                  <div className="mt-1 line-clamp-2 text-center text-xs">{color.name}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
