import ColorChip from '@/components/colors/ColorChip.tsx';
import ColorPicker from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorPicker.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx';
import {
  arePaletteColorsAvailable,
  compareColorsByLuminance,
} from '@/lib/colors.ts';
import { cn } from '@/lib/utils.ts';
import { Color, ColorPalette } from '@/models/color';
import { TemplateLayerColor } from '@/models/template.ts';
import React, { useEffect, useState } from 'react';

export type ColorsConfiguratorState = Pick<
  TemplateLayerColor['config'],
  'availableColors' | 'columns' | 'space'
>;

type TemplateLayerColorColorsConfiguratorProps =
  React.ComponentPropsWithoutRef<'div'> & {
    allColorPalettes: ColorPalette[];
    allColors: Color[];

    state?: ColorsConfiguratorState;
    onStateChange?: (state: ColorsConfiguratorState) => void;
  };

export default function TemplateLayerColorColorsConfigurator({
  className,
  allColorPalettes,
  allColors,
  state: stateProp,
  onStateChange,
  ...props
}: TemplateLayerColorColorsConfiguratorProps) {
  const [state, setState] = useState<ColorsConfiguratorState>(
    stateProp || {
      availableColors: [],
      columns: 5,
      space: 2,
    }
  );

  useEffect(() => {
    if (stateProp) {
      setState(stateProp);
    }
  }, [stateProp]);

  function addColorPalette(palette: ColorPalette) {
    const colorMap = new Map(
      state.availableColors.map((color) => [color.id, color])
    );

    for (const color of palette.colors) {
      if (!colorMap.has(color.id)) {
        colorMap.set(color.id, color);
      }
    }

    const newState = {
      ...state,
      availableColors: Array.from(colorMap.values()),
    };
    if (onStateChange) {
      onStateChange(newState);
    } else {
      setState(newState);
    }
  }

  function removeColorPalette(palette: ColorPalette) {
    const paletteColorIds = new Set(palette.colors.map((color) => color.id));

    const newState = {
      ...state,
      availableColors: state.availableColors.filter(
        (color) => !paletteColorIds.has(color.id)
      ),
    };

    if (onStateChange) {
      onStateChange(newState);
    } else {
      setState(newState);
    }
  }

  function selectColor(color: Color) {
    let changes: Color[] = [];

    if (state.availableColors.find((c) => c.id === color.id)) {
      changes = state.availableColors.filter((c) => c.id !== color.id);
    } else {
      changes = [...state.availableColors, color];
    }

    const newState = {
      ...state,
      availableColors: changes,
    };

    if (onStateChange) {
      onStateChange(newState);
    } else {
      setState(newState);
    }
  }

  function handleColumnsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    if (value < 1 || value > 12) return;

    const newState = {
      ...state,
      columns: value,
    };

    if (onStateChange) {
      onStateChange(newState);
    } else {
      setState(newState);
    }
  }

  function handleSpaceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    if (value < 0 || value > 6) return;

    const newState = {
      ...state,
      space: value,
    };

    if (onStateChange) {
      onStateChange(newState);
    } else {
      setState(newState);
    }
  }

  return (
    <div
      className={cn(
        'grid h-[80svh] grid-cols-[min-content_auto] gap-14',
        className
      )}
      {...props}
    >
      {/* Preview */}
      <div className="flex h-full flex-col overflow-hidden">
        <div className="mb-2 text-center uppercase">Aperçu</div>
        {/* TODO: create a layout component for configurator sidebar (keep width) */}
        <div className="h-full w-64 overflow-y-auto rounded-lg bg-gray-100 p-3">
          <h2 className="mb-4 text-lg font-semibold">Plaque avant</h2>
          {state.availableColors.length ? (
            <ColorPicker
              colors={state.availableColors}
              columns={state.columns}
              space={state.space}
            />
          ) : (
            <span className="text-sm">Sélectionne des couleurs</span>
          )}
        </div>
      </div>

      <Tabs defaultValue="palettes" className="h-full gap-4 overflow-hidden">
        <TabsList className="w-full">
          <TabsTrigger value="palettes">Palettes</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* Palettes */}
        <TabsContent value="palettes" className="h-full overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-8 px-1">
            {allColorPalettes.map((palette) => (
              <div key={palette.id} className="flex flex-col">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="font-semibold">{palette.name}</div>
                    <div className="text-sm text-gray-600">
                      {palette.description}
                    </div>
                  </div>
                  <Checkbox
                    className="h-5 w-5 [&_svg]:h-4 [&_svg]:w-4"
                    onCheckedChange={(checked) =>
                      checked
                        ? addColorPalette(palette)
                        : removeColorPalette(palette)
                    }
                    checked={arePaletteColorsAvailable(
                      palette,
                      state.availableColors
                    )}
                  />
                </div>

                <div className="mt-2 grid grid-cols-8 gap-2">
                  {palette.colors
                    .sort(compareColorsByLuminance)
                    .map((color) => (
                      <div key={color.id}>
                        <ColorChip className="w-full" color={color} />
                        <div className="mt-1 line-clamp-2 text-center text-xs">
                          {color.name}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Colors */}
        <TabsContent value="colors" className="mt-2">
          <div className="grid grid-cols-8 gap-2 px-1">
            {allColors.sort(compareColorsByLuminance).map((color) => (
              <div key={color.id}>
                <ColorChip
                  className="w-full"
                  color={color}
                  selectable
                  selected={
                    !!state.availableColors.find((c) => c.id === color.id)
                  }
                  onClick={() => selectColor(color)}
                />
                <div className="mt-1 line-clamp-2 text-center text-xs">
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Config */}
        <TabsContent value="config">
          <div className="mx-auto mt-4 grid w-[200px] grid-cols-2 gap-2 [&>input]:text-end">
            <Label htmlFor="columns">Colonnes</Label>
            <Input
              id="columns"
              type="number"
              min={1}
              max={12}
              value={state.columns}
              onChange={handleColumnsChange}
            />

            <Label htmlFor="space">Espaces</Label>
            <Input
              id="space"
              type="number"
              min={0}
              max={6}
              value={state.space}
              onChange={handleSpaceChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
