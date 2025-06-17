import ColorsOptionsCard from '@/components/template-editor/ColorsOptionsCard.tsx';
import FontsOptionsCard from '@/components/template-editor/EditTemplateLayerText/FontsOptionsCard.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { isTemplateLayerText } from '@/models/template.ts';

export default function EditTemplateLayerTextComponent() {
  const { currentLayer } = useTemplateEditorContext();

  if (!currentLayer || !isTemplateLayerText(currentLayer)) return null;

  return (
    <div className="flex flex-col gap-3">
      <FontsOptionsCard />
      <ColorsOptionsCard layer={currentLayer} />
    </div>
  );
}
