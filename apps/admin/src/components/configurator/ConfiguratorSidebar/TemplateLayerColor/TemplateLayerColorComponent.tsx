import ColorElementList from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorElementList.tsx';
import ColorGroupComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorGroupComponent.tsx';
import ColorItemComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorItemComponent.tsx';
import ColorLayerFocusControls from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorLayerFocusControls.tsx';
import ColorPaletteComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorPaletteComponent.tsx';
import { ColorPaletteSection } from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorPaletteSection.tsx';
import BackButton from '@/components/ui/BackButton.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { CurrentColorElementType } from '@/contexts/configurator/configurator-types.ts';
import { isTemplateLayerColor } from '@/models/template.ts';
import { ReactNode } from 'react';

const currentColorElementComponents: Record<CurrentColorElementType, ReactNode> = {
  group: <ColorGroupComponent />,
  item: <ColorItemComponent />,
  'color-palette': <ColorPaletteComponent />,
};

export default function TemplateLayerColorComponent() {
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

  return !currentColorElement ? (
    <div>
      <ColorLayerFocusControls />
      <ColorPaletteSection />
      <ColorElementList
        colorElements={currentLayer.colorElements}
        onColorElementClick={(colorElement) => setCurrentColorElementId(colorElement.id)}
      />
    </div>
  ) : (
    <div>
      <BackButton className="mb-3" onClick={goBack} />
      {currentColorElementComponents[currentColorElement.type]}
    </div>
  );
}
