import { Button } from '@/components/ui/button.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-context.ts';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.ts';

export default function DeleteCurrentLayerButton() {
  const { showSvgLayerPicker } = useTemplateEditorContext();

  const { template, setTemplate, currentLayer, setCurrentLayer } =
    useConfiguratorContext();

  function deleteCurrentLayer() {
    const updatedTemplate = {
      ...template,
      layers: template.layers.filter((layer) => layer.id !== currentLayer?.id),
    };

    setTemplate(updatedTemplate);
    setCurrentLayer(updatedTemplate.layers[(currentLayer?.order ?? 1) - 1]);
  }

  return !showSvgLayerPicker && currentLayer ? (
    <Button
      className="absolute right-0 bottom-0 left-0"
      variant="destructive"
      onClick={deleteCurrentLayer}
    >
      Supprimer le calque
    </Button>
  ) : null;
}
