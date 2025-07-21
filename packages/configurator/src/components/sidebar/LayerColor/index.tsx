import ColorElementList from '@/components/sidebar/LayerColor/color-elements/ColorElementList.tsx';
import ColorGroupComponent from '@/components/sidebar/LayerColor/ColorGroupComponent.tsx';
import ColorItemComponent from '@/components/sidebar/LayerColor/ColorItemComponent.tsx';
import LayerColorFocusControls from '@/components/sidebar/LayerColor/LayerColorFocusControls';
import { LayerColorPaletteSection } from '@/components/sidebar/LayerColor/LayerColorPaletteSection.tsx';
import { Button } from '@/components/ui/button';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { type ColorElement, isLayerColor } from '@clab/types';
import { ChevronLeft } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';

const currentColorElementComponents: Record<ColorElement['type'], ReactNode> = {
  group: <ColorGroupComponent />,
  item: <ColorItemComponent />,
};

export default function LayerColorComponent() {
  const { currentLayer, selectedColorElement, setSelectedColorElementId } =
    useConfiguratorContext();
  const { focusColorLayer } = useCanvas();

  useEffect(() => {
    if (!currentLayer || !isLayerColor(currentLayer)) return;

    // Reset focus mode when leaving the color layer
    return () => {
      if (currentLayer.config.focus.enable) {
        focusColorLayer(currentLayer, false);
      }
    };
  }, [currentLayer]);

  /**
   * Navigate back to the parent color element.
   */
  function goBack() {
    if (!selectedColorElement) return;
    const { parentId } = selectedColorElement;
    setSelectedColorElementId(parentId);
  }

  if (!currentLayer || !isLayerColor(currentLayer)) return null;

  return selectedColorElement ? (
    <div>
      <div className="flex items-center p-3">
        <Button variant="outline" size="icon" className="mr-3" onClick={goBack}>
          <ChevronLeft />
        </Button>
        <div className="text-lg">{selectedColorElement.name}</div>
      </div>

      {currentColorElementComponents[selectedColorElement.type]}
    </div>
  ) : (
    <div>
      <LayerColorFocusControls />
      <LayerColorPaletteSection />
      <ColorElementList
        colorElements={currentLayer.colorElements}
        onColorElementClick={(colorElement) => setSelectedColorElementId(colorElement.id)}
      />
    </div>
  );
}
