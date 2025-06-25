import ColorElementsOptionsCard from '@/components/Sidebar/LayerColor/ColorElementsOptionsCard.tsx';
import LayerColorOtherOptionsCard from '@/components/Sidebar/LayerColor/LayerColorOtherOptionsCard.tsx';
import ColorsOptionsCard from '@/components/Sidebar/shared/ColorsOptionsCard.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.tsx';
import { isTemplateLayerColor } from '@clab/types';

export default function EditTemplateLayerColorComponent() {
  const { currentLayer } = useTemplateEditorContext();
  if (!currentLayer || !isTemplateLayerColor(currentLayer)) return null;

  return (
    <div className="flex flex-col gap-3">
      <ColorElementsOptionsCard />
      <ColorsOptionsCard />
      <LayerColorOtherOptionsCard />
    </div>
  );
}
