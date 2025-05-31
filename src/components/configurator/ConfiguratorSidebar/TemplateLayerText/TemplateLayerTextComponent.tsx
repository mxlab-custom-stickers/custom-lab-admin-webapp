import { Button } from '@/components/ui/button.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { addText } from '@/lib/fabric.ts';

export default function TemplateLayerTextComponent() {
  const {
    state: { canvas },
  } = useConfiguratorContext();

  return (
    <div>
      <Button className="w-full" onClick={() => addText(canvas!)}>
        Ajouter un texte
      </Button>
    </div>
  );
}
