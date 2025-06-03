import { Button } from '@/components/ui/button.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { drawTextOnCanvas } from '@/lib/fabric.ts';
import { generateId } from '@/lib/nanoid.ts';
import { Text } from '@/models/text.ts';

export default function TemplateLayerTextComponent() {
  const {
    state: { canvas },
    currentLayer,
    updateLayer,
  } = useConfiguratorContext();

  function addNewText() {
    if (!canvas || currentLayer?.type !== 'text') return;

    const newText: Text = {
      id: generateId(),
      value: 'Mon Texte',
      fontSize: 64,
      fontFamily: 'sans-serif',
      x: 100,
      y: 100,
      width: 300,
      height: 100,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
    };

    const fabricText = drawTextOnCanvas(canvas, newText);

    updateLayer({
      ...currentLayer,
      texts: [...(currentLayer.texts || []), { ...newText, fabricText }],
    });
  }

  return (
    <div>
      <Button className="w-full" onClick={addNewText}>
        Ajouter un texte
      </Button>
    </div>
  );
}
