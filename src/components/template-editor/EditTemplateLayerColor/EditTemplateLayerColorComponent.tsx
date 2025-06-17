import ColorElementsOptionsCard from '@/components/template-editor/EditTemplateLayerColor/ColorElementsOptionsCard.tsx';
import ColorsOptionsCard from '@/components/template-editor/EditTemplateLayerColor/ColorsOptionsCard.tsx';
import OtherOptionsCard from '@/components/template-editor/EditTemplateLayerColor/OtherOptionsCard.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { isTemplateLayerColor } from '@/models/template.ts';

export default function EditTemplateLayerColorComponent() {
  const { currentLayer } = useTemplateEditorContext();

  if (!currentLayer || !isTemplateLayerColor(currentLayer)) return null;

  return (
    <div className="flex flex-col gap-3">
      <ColorElementsOptionsCard />
      <ColorsOptionsCard />
      <OtherOptionsCard />
    </div>
  );
}
