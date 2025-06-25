import { Button } from '@/components/ui/button.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { drawTextOnCanvas } from '@/lib/fabric.ts';
import type { Text } from '@clab/types';
import { generateId } from '@clab/utils';

export default function LayerTextComponent() {
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
      font: null,
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      lineHeight: 1,
      charSpacing: 0,
      color: { id: 'default-color', name: 'Black', value: '#000000' }, // Default color
      strokeColor: null,
      strokeWidth: 0,
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
      <Button className="w-full uppercase" onClick={addNewText}>
        Ajouter un texte
      </Button>
    </div>
  );
}
