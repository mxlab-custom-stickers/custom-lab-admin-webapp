import ColorPicker from '@/components/ColorPicker.tsx';
import { Button } from '@/components/ui/button.tsx';
import NumberInput from '@/components/ui/NumberInput.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { type Color, isLayerText } from '@clab/types';
import { X } from 'lucide-react';

export default function TextColorPicker() {
  const { currentLayer, selectedObject, updateText, setSidebarView } = useConfiguratorContext();
  if (!currentLayer || !isLayerText(currentLayer) || selectedObject?.type !== 'text') return null;

  const { updateFabricText } = useCanvas();

  function handleColorChange(color: Color) {
    if (selectedObject?.type !== 'text' || selectedObject.text.locked) return;

    if (selectedObject.text.fabricObject) {
      updateFabricText(selectedObject.text.fabricObject, { fill: color.value });
    }
    updateText({ ...selectedObject.text, color });
  }

  function handleStrokeColorChange(strokeColor: Color) {
    if (selectedObject?.type !== 'text' || selectedObject.text.locked) return;

    if (selectedObject.text.fabricObject) {
      updateFabricText(selectedObject.text.fabricObject, { stroke: strokeColor.value });
    }
    updateText({ ...selectedObject.text, strokeColor });
  }

  function handleStrokeWidthChange(strokeWidth: number) {
    if (selectedObject?.type !== 'text' || selectedObject.text.locked) return;

    if (selectedObject.text.fabricObject) {
      updateFabricText(selectedObject.text.fabricObject, { strokeWidth });
    }
    updateText({ ...selectedObject.text, strokeWidth });
  }

  const { text } = selectedObject;

  return (
    <div className="p-3">
      <Tabs defaultValue="text">
        <div className="flex items-center gap-1">
          <TabsList className="flex-1 *:text-base">
            <TabsTrigger value="text">Texte</TabsTrigger>
            <TabsTrigger value="stroke">Contours</TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="icon" onClick={() => setSidebarView(undefined)}>
            <X className="!h-5 !w-5" />
          </Button>
        </div>

        {/* Text color */}
        <TabsContent value="text">
          <div className="mb-1.5 text-xl uppercase">Couleur du texte</div>
          <ColorPicker
            colors={currentLayer.config.availableColors}
            value={text.color}
            onValueChange={handleColorChange}
          />
        </TabsContent>

        {/* Stroke color */}
        <TabsContent value="stroke">
          <div className="mb-1.5 text-xl uppercase">Taille des contours</div>
          <NumberInput
            wrapperClassName="w-fit mb-3"
            min={0}
            max={10}
            step={0.5}
            value={text.strokeWidth}
            onValueChange={handleStrokeWidthChange}
          />
          <div className="mb-1.5 text-xl uppercase">Couleur des contours</div>
          <ColorPicker
            colors={currentLayer.config.availableColors}
            value={text.strokeColor || undefined}
            onValueChange={handleStrokeColorChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
