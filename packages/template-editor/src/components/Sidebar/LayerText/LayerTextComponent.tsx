import FontsOptionsCard from '@/components/Sidebar/LayerText/FontsOptionsCard.tsx';
import ColorsOptionsCard from '@/components/Sidebar/shared/ColorsOptionsCard.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.tsx';
import { isTemplateLayerText } from '@clab/types';

export default function LayerTextComponent() {
  const { currentLayer } = useTemplateEditorContext();

  if (!currentLayer || !isTemplateLayerText(currentLayer)) return null;

  return (
    <div className="flex flex-col gap-3">
      <FontsOptionsCard />
      <ColorsOptionsCard />
    </div>
  );
}
