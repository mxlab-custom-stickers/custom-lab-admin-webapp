import EditTemplateLayerColorComponent from '@/components/template-editor/EditTemplateLayerColor/EditTemplateLayerColor.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { TemplateLayerType } from '@/models/template.ts';
import { ReactNode } from 'react';

export default function CurrentLayerComponent() {
  const {
    state: { template, currentLayerId },
  } = useTemplateEditorContext();

  const currentLayerType = template.layers.find(
    (layer) => layer.id === currentLayerId
  )?.type;

  const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
    color: <EditTemplateLayerColorComponent />,
    image: <div>Image Layer</div>,
    text: <div>Text Layer</div>,
    background: <div>Background Layer</div>,
  };

  return currentLayerType ? currentLayerComponents[currentLayerType] : null;
}
