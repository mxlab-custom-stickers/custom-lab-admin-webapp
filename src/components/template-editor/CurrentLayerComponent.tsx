import EditTemplateLayerColorComponent from '@/components/template-editor/EditTemplateLayerColor.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-context.ts';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.ts';
import { TemplateLayerType } from '@/models/template.ts';
import { ReactNode } from 'react';

export default function CurrentLayerComponent() {
  const { showSvgLayerPicker } = useTemplateEditorContext();
  const { currentLayer } = useConfiguratorContext();

  const currentLayerComponent: Record<TemplateLayerType, ReactNode> = {
    color: <EditTemplateLayerColorComponent />,
    image: <div>Image Layer</div>,
    text: <div>Text Layer</div>,
    background: <div>Background Layer</div>,
  };

  return !showSvgLayerPicker && currentLayer
    ? currentLayerComponent[currentLayer.type]
    : null;
}
