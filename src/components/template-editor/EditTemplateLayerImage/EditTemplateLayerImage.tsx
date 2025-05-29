import ImagesOptionsCard from '@/components/template-editor/EditTemplateLayerImage/ImagesOptionsCard.tsx';
import OtherOptionsCard from '@/components/template-editor/EditTemplateLayerImage/OtherOptionsCard.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import ClipWithOptionsCard from './ClipWithOptionsCard.tsx';

export default function EditTemplateLayerImage() {
  const { currentLayer, updateLayer } = useTemplateEditorContext();

  if (!currentLayer || currentLayer.type !== 'image') {
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

      <ImagesOptionsCard />
      <ClipWithOptionsCard />
      <OtherOptionsCard />
    </div>
  );
}
