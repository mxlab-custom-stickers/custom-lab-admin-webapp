import ColorElementList from '@/components/Sidebar/LayerColor/color-elements/ColorElementList.tsx';
import ColorGroupComponent from '@/components/Sidebar/LayerColor/ColorGroupComponent.tsx';
import ColorItemComponent from '@/components/Sidebar/LayerColor/ColorItemComponent.tsx';
import LayerColorFocusControls from '@/components/Sidebar/LayerColor/LayerColorFocusControls';
import { LayerColorPaletteSection } from '@/components/Sidebar/LayerColor/LayerColorPaletteSection.tsx';
import { Button } from '@/components/ui/button';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { type ColorElement, isTemplateLayerColor } from '@clab/types';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

const currentColorElementComponents: Record<ColorElement['type'], ReactNode> = {
  group: <ColorGroupComponent />,
  item: <ColorItemComponent />,
};

export default function Index() {
  const { currentLayer, selectedColorElement, setSelectedColorElementId } =
    useConfiguratorContext();
  if (!currentLayer || !isTemplateLayerColor(currentLayer)) return null;

  /**
   * Navigate back to the parent color element.
   */
  function goBack() {
    if (!selectedColorElement) return;
    const { parentId } = selectedColorElement;
    setSelectedColorElementId(parentId);
  }

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
