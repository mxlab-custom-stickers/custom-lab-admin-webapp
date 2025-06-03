import ColorElementsOptionsCard from '@/components/template-editor/EditTemplateLayerColor/ColorElementsOptionsCard.tsx';
import ColorsOptionsCard from '@/components/template-editor/EditTemplateLayerColor/ColorsOptionsCard.tsx';
import OtherOptionsCard from '@/components/template-editor/EditTemplateLayerColor/OtherOptionsCard.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';

export default function EditTemplateLayerColorComponent() {
  const { currentLayer, updateLayer } = useTemplateEditorContext();

  if (!currentLayer || currentLayer.type !== 'color') {
    return null; // Return null if the current layer is not an image layer
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

      <ColorElementsOptionsCard />
      <ColorsOptionsCard />
      <OtherOptionsCard />
    </div>
  );
}
