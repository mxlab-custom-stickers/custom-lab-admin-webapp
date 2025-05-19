import { ConfiguratorContext } from '@/contexts/configurator-context.ts';
import { updateColorElement } from '@/lib/configurator.ts';
import { cn } from '@/lib/utils.ts';
import {
  ColorElement,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';
import React, { useState } from 'react';

type ConfiguratorProps = React.ComponentPropsWithoutRef<'div'> & {
  template: Template;
  onTemplateChange: (template: Template) => void;
};

export default function Configurator({
  className,
  children,
  template,
  onTemplateChange,
  ...props
}: ConfiguratorProps) {
  const [currentLayer, _setCurrentLayer] = useState<
    TemplateLayerColor | undefined
  >(template.layers[0]);
  const [currentColorElement, setCurrentColorElement] =
    useState<ColorElement>();

  const [svgInjecting, setSvgInjecting] = useState<boolean>(true);

  function setTemplate(template: Template) {
    onTemplateChange(template);
  }

  function setCurrentLayer(layer: TemplateLayerColor | undefined) {
    _setCurrentLayer(layer);
    setCurrentColorElement(undefined);
  }

  function updateCurrentLayer(layer: TemplateLayerColor) {
    if (!currentLayer) return;

    const updatedTemplate = {
      ...template,
      layers: template.layers.map((l) =>
        l.id === currentLayer.id ? layer : l
      ),
    };

    setTemplate(updatedTemplate);
    setCurrentLayer(layer);
    setCurrentColorElement(currentColorElement);
  }

  function updateCurrentColorElement(updates: ColorElement) {
    if (!currentLayer || !currentColorElement) return;

    const updatedColorElements = updateColorElement(
      currentLayer.colorElements,
      updates
    );

    const updatedLayer = {
      ...currentLayer,
      colorElements: updatedColorElements,
    };

    const updatedTemplate = {
      ...template,
      layers: template.layers.map((l) =>
        l.id === currentLayer.id ? updatedLayer : l
      ),
    };

    setTemplate(updatedTemplate);
    setCurrentLayer(updatedLayer);
    setCurrentColorElement(updates);
  }

  return (
    <ConfiguratorContext.Provider
      value={{
        template,
        setTemplate,
        svgInjecting,
        setSvgInjecting,
        currentLayer,
        setCurrentLayer,
        updateCurrentLayer,
        currentColorElement,
        setCurrentColorElement,
        updateCurrentColorElement,
      }}
    >
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </ConfiguratorContext.Provider>
  );
}
