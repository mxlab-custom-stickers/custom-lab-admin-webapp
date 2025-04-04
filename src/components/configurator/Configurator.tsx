import { ConfiguratorContext } from '@/contexts/configurator-context.ts';
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

  return (
    <ConfiguratorContext.Provider
      value={{
        template,
        setTemplate,
        svgInjecting,
        setSvgInjecting,
        currentLayer,
        setCurrentLayer,
        currentColorElement,
        setCurrentColorElement,
      }}
    >
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </ConfiguratorContext.Provider>
  );
}
