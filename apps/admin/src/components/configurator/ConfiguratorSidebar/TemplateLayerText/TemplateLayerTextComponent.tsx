import CurrentTextEditor from '@/components/configurator/ConfiguratorSidebar/TemplateLayerText/CurrentTextEditor.tsx';
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
    currentText,
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
      {currentText ? (
        <CurrentTextEditor />
      ) : (
        <Button className="w-full" onClick={addNewText}>
          Ajouter un texte
        </Button>
      )}
    </div>
  );
}
