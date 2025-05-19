import ColorChip from '@/components/colors/ColorChip.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput';
import { Label } from '@/components/ui/label.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-context.ts';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.ts';
import { compareColorsByLuminance } from '@/lib/colors.ts';
import { getAllAvailableColors } from '@/lib/configurator.ts';
import { Color, ColorPalette } from '@/models/color.ts';
import { useMemo } from 'react';
import ColorSelector from '../colors/ColorSelector';

export default function EditTemplateLayerColorComponent() {
  const { allColorPalettes, allColors, setShowSvgLayerPicker } =
    useTemplateEditorContext();

  const { currentLayer, updateCurrentLayer } = useConfiguratorContext();

  const allAvailableColors = useMemo(
    () => (currentLayer ? getAllAvailableColors(currentLayer) : []),
    [currentLayer?.config]
  );

  function updateCurrentLayerName(name: string) {
    if (!currentLayer || !updateCurrentLayer) return;
    updateCurrentLayer({ ...currentLayer, name });
  }

  function handleColorSelectorChange({
    colorPalettes,
    colors,
  }: {
    colorPalettes: ColorPalette[];
    colors: Color[];
  }) {
    if (!currentLayer || !updateCurrentLayer) return;
    const updatedConfig = {
      ...currentLayer.config,
      availableColorPalettes: colorPalettes,
      availableColors: colors,
    };
    updateCurrentLayer({ ...currentLayer, config: updatedConfig });
  }

  function handleColumnsChange(value: string) {
    if (!currentLayer || !updateCurrentLayer || isNaN(Number(value))) return;
    const updatedConfig = {
      ...currentLayer.config,
      columns: Number(value),
    };
    updateCurrentLayer({ ...currentLayer, config: updatedConfig });
  }

  function handleSpaceChange(value: string) {
    if (!currentLayer || !updateCurrentLayer || isNaN(Number(value))) return;
    const updatedConfig = {
      ...currentLayer.config,
      space: Number(value),
    };
    updateCurrentLayer({ ...currentLayer, config: updatedConfig });
  }

  return (
    <div className="flex flex-col gap-3">
      <InvisibleInput
        className="!text-lg font-semibold"
        value={currentLayer?.name}
        onSubmit={updateCurrentLayerName}
      />

      <Card className="gap-2 border-none py-4 shadow-none *:px-4">
        <CardHeader>
          <CardTitle>Calque</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setShowSvgLayerPicker(true)}
          >
            Modifier le calque
          </Button>
        </CardContent>
      </Card>

      <Card className="gap-2 border-none py-4 shadow-none *:px-4">
        <CardHeader>
          <CardTitle>Couleurs ({allAvailableColors.length})</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full" variant="outline">
                Sélectionner les couleurs
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="left"
              align="start"
              sideOffset={20}
              className="w-full"
            >
              <ColorSelector
                allColorPalettes={allColorPalettes}
                allColors={allColors}
                selectedColorPalettes={
                  currentLayer?.config.availableColorPalettes
                }
                selectedColors={currentLayer?.config.availableColors}
                onChange={handleColorSelectorChange}
              />
            </PopoverContent>
          </Popover>

          <div className="grid grid-cols-8 gap-1 py-1">
            {allAvailableColors.sort(compareColorsByLuminance).map((color) => (
              <ColorChip key={color.id} className="w-full" color={color} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 *:flex *:flex-col">
            <Label>
              Colonnes
              <Input
                type="number"
                min={1}
                max={12}
                value={currentLayer?.config.columns}
                onChange={(e) => handleColumnsChange(e.target.value)}
              />
            </Label>

            <Label>
              Espaces
              <Input
                type="number"
                min={0}
                max={6}
                value={currentLayer?.config.space}
                onChange={(e) => handleSpaceChange(e.target.value)}
              />
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
