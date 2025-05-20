import { Button } from '@/components/ui/button.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';

export default function DeleteCurrentLayerButton() {
  const {
    state: { template, showSvgLayerPicker },
  } = useTemplateEditorContext();

  // const { template, updateTemplate, currentLayer, setCurrentLayer } =
  //   useConfiguratorContext();

  function deleteCurrentLayer() {
    // const updatedTemplate = {
    //   ...template,
    //   layers: template.layers.filter((layer) => layer.id !== currentLayer?.id),
    // };
    // updateTemplate(updatedTemplate);
    // setCurrentLayer(updatedTemplate.layers[(currentLayer?.order ?? 1) - 1]);
  }

  // return !showSvgLayerPicker && currentLayer ? (
  //   <Button
  //     className="absolute right-0 bottom-0 left-0"
  //     variant="destructive"
  //     onClick={deleteCurrentLayer}
  //   >
  //     Supprimer le calque
  //   </Button>
  // ) : null;

  return (
    <Button className="absolute right-0 bottom-0 left-0" variant="destructive">
      Supprimer le calque
    </Button>
  );
}
