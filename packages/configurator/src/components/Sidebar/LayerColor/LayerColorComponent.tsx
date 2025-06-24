import ColorElementList from '@/components/Sidebar/LayerColor/color-elements/ColorElementList.tsx';
import ColorGroupComponent from '@/components/Sidebar/LayerColor/ColorGroupComponent.tsx';
import ColorItemComponent from '@/components/Sidebar/LayerColor/ColorItemComponent.tsx';
import ColorPaletteComponent from '@/components/Sidebar/LayerColor/ColorPaletteComponent.tsx';
import LayerColorFocusControls from '@/components/Sidebar/LayerColor/LayerColorFocusControls';
import { LayerColorPaletteSection } from '@/components/Sidebar/LayerColor/LayerColorPaletteSection.tsx';
import { Button } from '@/components/ui/button';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import type { CurrentColorElementType } from '@/contexts/configurator-types';
import { isTemplateLayerColor } from '@clab/types';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

const currentColorElementComponents: Record<CurrentColorElementType, ReactNode> = {
  group: <ColorGroupComponent />,
  item: <ColorItemComponent />,
  'color-palette': <ColorPaletteComponent />,
};

export default function LayerColorComponent() {
  const { currentLayer, currentColorElement, setCurrentColorElementId } = useConfiguratorContext();
  if (!currentLayer || !isTemplateLayerColor(currentLayer)) return null;

  /**
   * Navigate back to the parent color element.
   */
  function goBack() {
    if (!currentColorElement) return;
    const { parentId } = currentColorElement;
    setCurrentColorElementId(parentId);
  }

  return currentColorElement ? (
    <div>
      <Button className="mb-2" onClick={goBack}>
        <ChevronLeft />
      </Button>
      {currentColorElementComponents[currentColorElement.type]}
    </div>
  ) : (
    <div>
      <LayerColorFocusControls />
      <LayerColorPaletteSection />
      <ColorElementList
        colorElements={currentLayer.colorElements}
        onColorElementClick={(colorElement) => setCurrentColorElementId(colorElement.id)}
      />
    </div>
  );
}
