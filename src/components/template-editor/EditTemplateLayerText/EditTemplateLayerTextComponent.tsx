import ColorsOptionsCard from '@/components/template-editor/ColorsOptionsCard.tsx';
import FontsOptionsCard from '@/components/template-editor/EditTemplateLayerText/FontsOptionsCard.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';

export default function EditTemplateLayerTextComponent() {
  const { currentLayer, updateLayer } = useTemplateEditorContext();

  if (!currentLayer || currentLayer.type !== 'text') {
    return null; // Return null if the current layer is not a text layer
  }

  function updateCurrentLayerName(name: string) {
    if (!currentLayer) return;
    updateLayer({ ...currentLayer, name });
  }

  return (
    <div className="flex flex-col gap-3">
      <InvisibleInput
        className="!text-lg font-semibold"
        value={currentLayer?.name}
        onSubmit={updateCurrentLayerName}
      />

      <FontsOptionsCard />
      <ColorsOptionsCard layer={currentLayer} />
    </div>
  );
}
