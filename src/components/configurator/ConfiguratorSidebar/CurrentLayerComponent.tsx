import TemplateLayerColorComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/TemplateLayerColorComponent.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { cn } from '@/lib/utils.ts';
import { TemplateLayerType } from '@/models/template.ts';
import React, { ReactNode } from 'react';

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <TemplateLayerColorComponent />,
  image: <div />,
  text: <div>Text Layer</div>,
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
