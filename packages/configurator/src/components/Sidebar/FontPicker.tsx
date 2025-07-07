import { Button } from '@/components/ui/button.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { loadFont } from '@/lib/fontLoader.ts';
import { type Font, isTemplateLayerText } from '@clab/types';
import { Check, X } from 'lucide-react';
import { useEffect } from 'react';

export default function FontPicker() {
  const { currentLayer, selectedObject, updateText, setSidebarView } = useConfiguratorContext();
  if (!currentLayer || !isTemplateLayerText(currentLayer) || selectedObject?.type !== 'text')
    return null;

  const { updateFabricText } = useCanvas();

  useEffect(() => {
    currentLayer.config.availableFonts.map(loadFont);
  }, [currentLayer.config.availableFonts]);

  function handleFontPick(font: Font) {
    if (selectedObject?.type !== 'text' || selectedObject.text.locked) return;

    if (selectedObject.text.fabricObject) {
      updateFabricText(selectedObject.text.fabricObject, { fontFamily: font.name });
    }
    updateText({ ...selectedObject.text, font });
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 flex items-center border-b bg-[#454545] px-3 py-2">
        <div className="flex-1 text-xl font-semibold uppercase">Police</div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarView(undefined)}>
          <X className="!h-5 !w-5" />
        </Button>
      </div>

      {/* Font list */}
      <div className="flex flex-col">
        {currentLayer.config.availableFonts.map((font) => (
          <div
            key={font.id}
            className="flex cursor-pointer items-center px-3 py-2 text-xl hover:bg-[#454545]"
            style={{ fontFamily: font.name }}
            onClick={() => handleFontPick(font)}
          >
            <div className="line-clamp-1 flex-1">{font.name}</div>
            {font.id === selectedObject.text.font?.id ? <Check /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
