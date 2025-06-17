import ColorPicker from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorPicker.tsx';
import FontPicker from '@/components/configurator/ConfiguratorSidebar/TemplateLayerText/FontPicker.tsx';
import { Label } from '@/components/ui/label.tsx';
import NumberInput from '@/components/ui/NumberInput.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { useFonts } from '@/hooks/use-fonts.ts';
import { Color } from '@/models/color.ts';
import { Font } from '@/models/text.ts';
import { useMemo } from 'react';

export default function CurrentTextEditor() {
  const {
    state: { canvas },
    currentLayer,
    currentText,
    updateText,
  } = useConfiguratorContext();

  const { fonts } = useFonts();

  if (currentLayer?.type !== 'text' || !currentText) return null;

  const { config } = currentLayer;

  const availableFonts: Font[] = useMemo(
    () =>
      config.availableFonts
        .map((fontName) => fonts.find((font) => font.name === fontName))
        .filter((font) => font !== undefined),
    [config.availableFonts, fonts]
  );

  function handleFontPick(font: Font) {
    if (!currentText) return;

    currentText.fabricText?.set({ fontFamily: font.name });
    canvas?.requestRenderAll();

    updateText({ ...currentText, font });
  }

  function handleColorPick(color: Color) {
    if (!currentText) return;

    currentText?.fabricText?.set({ fill: color.value });
    canvas?.requestRenderAll();

    updateText({ ...currentText, color });
  }

  function handleStrokeWidthChange(strokeWidth: number) {
    if (!currentText) return;

    const strokeColor = currentText.strokeColor || {
      id: 'default-stroke-color',
      name: 'Black',
      value: '#000000',
    };

    currentText.fabricText?.set({
      strokeWidth,
      stroke: strokeColor.value,
    });
    canvas?.requestRenderAll();

    updateText({ ...currentText, strokeWidth, strokeColor });
  }

  function handleStrokeColorChange(color: Color) {
    if (!currentText) return;

    currentText.fabricText?.set({ stroke: color.value });
    canvas?.requestRenderAll();

    updateText({ ...currentText, strokeColor: color });
  }

  return (
    <div>
      <div className="mb-3 font-semibold">Personnalise ton texte</div>

      <Tabs defaultValue="fonts">
        <TabsList className="mb-1">
          <TabsTrigger value="fonts">Polices</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="strokes">Contours</TabsTrigger>
        </TabsList>

        {/* Font */}
        <TabsContent value="fonts">
          <FontPicker
            fonts={availableFonts}
            value={currentText.font || undefined}
            onValueChange={handleFontPick}
          />
        </TabsContent>
        {/* Text color */}
        <TabsContent value="colors">
          <div className="mb-2 text-sm font-medium">Couleur du texte</div>
          <ColorPicker
            colors={config.availableColors}
            value={currentText.color}
            onValueChange={handleColorPick}
          />
        </TabsContent>
        {/* Stroke width and color */}
        <TabsContent value="strokes" className="flex flex-col gap-3">
          <Label>
            Taille du contour
            <NumberInput
              value={currentText.strokeWidth}
              onValueChange={handleStrokeWidthChange}
              min={0}
              max={100}
            />
          </Label>
          <div>
            <div className="mb-2 text-sm font-medium">Couleur du contour</div>
            <ColorPicker
              colors={config.availableColors}
              value={currentText.strokeColor || undefined}
              onValueChange={handleStrokeColorChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
