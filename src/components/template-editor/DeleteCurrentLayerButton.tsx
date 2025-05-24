import { Button } from '@/components/ui/button.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';

export default function DeleteCurrentLayerButton() {
  const {
    state: { template, currentLayer },
    updateTemplate,
    setCurrentLayer,
  } = useTemplateEditorContext();

  function deleteCurrentLayer() {
    if (!currentLayer) return;

    const updatedTemplate = {
      ...template,
      layers: template.layers.filter((layer) => layer.id !== currentLayer.id),
    };
    updateTemplate(updatedTemplate);
    setCurrentLayer(
      template.layers.find((layer) => layer.order === currentLayer.order - 1)
        ?.id
    );
  }

  return currentLayer ? (
    <Button
      className="absolute right-0 bottom-0 left-0"
      variant="destructive"
      onClick={deleteCurrentLayer}
    >
      Supprimer le calque
    </Button>
  ) : null;
}
