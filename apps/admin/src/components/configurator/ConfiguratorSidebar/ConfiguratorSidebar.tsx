import SidebarFooter from '@/components/configurator/ConfiguratorSidebar/SidebarFooter.tsx';
import TemplateLayerColorComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/TemplateLayerColorComponent.tsx';
import TemplateLayerImageComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerImage/TemplateLayerImageComponent.tsx';
import TemplateLayerTextComponent from '@/components/configurator/ConfiguratorSidebar/TemplateLayerText/TemplateLayerTextComponent.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { useOptionalTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils.ts';
import { TemplateLayerType } from '@/models/template.ts';
import * as React from 'react';
import { ReactNode } from 'react';

type ConfiguratorSidebarProps = React.ComponentPropsWithoutRef<'div'>;

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <TemplateLayerColorComponent />,
  image: <TemplateLayerImageComponent />,
  text: <TemplateLayerTextComponent />,
  background: <div>Background Layer</div>,
};

export default function ConfiguratorSidebar({ className, ...props }: ConfiguratorSidebarProps) {
  const { currentLayer } = useConfiguratorContext();

  const templateEditorContext = useOptionalTemplateEditorContext();

  function handleNameChange(name: string) {
    if (!templateEditorContext || !currentLayer) return;

    templateEditorContext.updateLayer({
      ...currentLayer,
      name,
    });
  }

  return (
    <div className={cn('row-span-2 w-64 border-r bg-white', className)} {...props}>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-2">
          {currentLayer ? (
            <>
              <InvisibleInput
                className="mb-2 !text-lg font-semibold"
                defaultValue={currentLayer.name}
                onValueSubmit={handleNameChange}
              />
              {/* Current layer component */}
              {currentLayer ? currentLayerComponents[currentLayer.type] : null}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <SidebarFooter />
      </div>
    </div>
  );
}
