import ColorElementsOptionsCard from '@/components/template-editor/EditTemplateLayerColor/ColorElementsOptionsCard.tsx';
import ColorsOptionsCard from '@/components/template-editor/EditTemplateLayerColor/ColorsOptionsCard.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';

export default function EditTemplateLayerColorComponent() {
  const {
    state: { template, currentLayerId },
    updateCurrentLayer,
  } = useTemplateEditorContext();

  const currentLayer = template.layers.find(
    (layer) => layer.id === currentLayerId
  );

  function updateCurrentLayerName(name: string) {
    if (!currentLayer) return;
    updateCurrentLayer({ ...currentLayer, name });
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
    </div>
  );
}
