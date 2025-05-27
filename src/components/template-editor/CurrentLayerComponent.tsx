import EditTemplateLayerColorComponent from '@/components/template-editor/EditTemplateLayerColor/EditTemplateLayerColor.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { TemplateLayerType } from '@/models/template.ts';
import { ReactNode } from 'react';

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <EditTemplateLayerColorComponent />,
  image: <div>Image Layer</div>,
  text: <div>Text Layer</div>,
  background: <div>Background Layer</div>,
};

export default function CurrentLayerComponent() {
  const { currentLayer } = useTemplateEditorContext();

  return currentLayer ? currentLayerComponents[currentLayer?.type] : null;
}
