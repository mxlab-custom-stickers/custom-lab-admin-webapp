import TemplateLayerColorComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/TemplateLayerColorComponent.tsx';
import TemplateLayerImageComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerImage/TemplateLayerImageComponent.tsx';
import TemplateLayerTextComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerText/TemplateLayerTextComponent.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { cn } from '@/lib/utils.ts';
import { TemplateLayerType } from '@/models/template.ts';
import React, { ReactNode } from 'react';

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <TemplateLayerColorComponent />,
  image: <TemplateLayerImageComponent />,
  text: <TemplateLayerTextComponent />,
  background: <div>Background Layer</div>,
};

export default function CurrentLayerComponent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { currentLayer } = useConfiguratorContext();

  return (
    <div className={cn(className)} {...props}>
      {currentLayer ? currentLayerComponents[currentLayer.type] : null}
    </div>
  );
}
