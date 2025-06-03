import EditTemplateLayerColorComponent from '@/components/template-editor/EditTemplateLayerColor/EditTemplateLayerColorComponent.tsx';
import EditTemplateLayerImageComponent from '@/components/template-editor/EditTemplateLayerImage/EditTemplateLayerImageComponent.tsx';
import EditTemplateLayerTextComponent from '@/components/template-editor/EditTemplateLayerText/EditTemplateLayerTextComponent.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { TemplateLayerType } from '@/models/template.ts';
import { ReactNode } from 'react';

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <EditTemplateLayerColorComponent />,
  image: <EditTemplateLayerImageComponent />,
  text: <EditTemplateLayerTextComponent />,
  background: <div>Background Layer</div>,
};

export default function CurrentLayerComponent() {
  const { currentLayer } = useTemplateEditorContext();

  return currentLayer ? currentLayerComponents[currentLayer.type] : null;
}
