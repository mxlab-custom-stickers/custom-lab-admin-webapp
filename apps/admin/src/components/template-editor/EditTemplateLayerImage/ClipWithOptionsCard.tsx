import OptionsCard from '@/components/template-editor/OptionsCard.tsx';
import TemplateLayerSelector from '@/components/template-editor/TemplateLayerSelector.tsx';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { clipImageLayerToColorLayer, unclipImageLayer } from '@/lib/fabric.ts';

export default function ClipWithOptionsCard() {
  const {
    state: { template, canvas },
    currentLayer,
    updateLayer,
  } = useTemplateEditorContext();

  if (currentLayer?.type !== 'image') return null;

  const {
    config: { clipWithLayerId },
  } = currentLayer;

  async function handleClipWithLayerChange(layerIds: string[]) {
    if (currentLayer?.type !== 'image') return;

    let newClipWithLayerId: string | null;

    if (layerIds.length === 1) {
      newClipWithLayerId = layerIds[0];
    } else if (layerIds.length === 2) {
      newClipWithLayerId = layerIds.filter((layerId) => layerId !== clipWithLayerId)[0];
    } else {
      newClipWithLayerId = null;
    }

    if (canvas) {
      if (newClipWithLayerId) {
        const clipWithLayer = template.layers.find((l) => l.id === newClipWithLayerId);
        if (clipWithLayer && clipWithLayer.type === 'color') {
          await clipImageLayerToColorLayer(canvas, currentLayer, clipWithLayer);
        }
      } else {
        await unclipImageLayer(canvas, currentLayer);
      }
    }

    updateLayer({
      ...currentLayer,
      config: { ...currentLayer.config, clipWithLayerId: newClipWithLayerId },
    });
  }

  return (
    <OptionsCard>
      <CardHeader>
        <CardTitle>Clip</CardTitle>
        <CardDescription className="text-xs">Clipper avec un calque de couleur</CardDescription>
      </CardHeader>

      <CardContent>
        <TemplateLayerSelector
          value={clipWithLayerId ? [clipWithLayerId] : []}
          onChange={handleClipWithLayerChange}
        />
      </CardContent>
    </OptionsCard>
  );
}
