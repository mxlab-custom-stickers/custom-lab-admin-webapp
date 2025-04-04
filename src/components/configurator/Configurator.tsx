import ConfiguratorSidebar from '@/components/configurator/ConfiguratorSidebar.tsx';
import LayersBar from '@/components/configurator/LayersBar.tsx';
import { Svg } from '@/components/svg.tsx';
import { ConfiguratorContext } from '@/contexts/configurator-context.ts';
import { cn } from '@/lib/utils';
import { EditTemplate } from '@/models/template.ts';
import React, { useState } from 'react';

type ConfiguratorProps = React.ComponentPropsWithoutRef<'div'> & {
  template: EditTemplate;
  afterSvgInjection?: () => void;
};

export default function Configurator({
  className,
  template,
  afterSvgInjection,
  ...props
}: ConfiguratorProps) {
  const [currentLayerId] = useState<string>(template.layers[0]?.id);

  return (
    <ConfiguratorContext.Provider value={{ template, currentLayerId }}>
      <div
        className={cn('grid h-full grid-cols-[min-content_auto]')}
        {...props}
      >
        <ConfiguratorSidebar template={template} />

        <div className="flex flex-col justify-center">
          <div className="flex-1 [&_div]:h-full">
            <Svg afterInjection={afterSvgInjection} />
          </div>

          <LayersBar template={template} />
        </div>
      </div>
    </ConfiguratorContext.Provider>
  );
}
