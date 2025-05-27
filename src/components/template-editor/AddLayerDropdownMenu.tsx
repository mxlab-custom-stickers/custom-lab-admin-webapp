import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import {
  TemplateLayerColor,
  TemplateLayerType,
  templateLayerTypes,
} from '@/models/template.ts';
import { Plus } from 'lucide-react';

export default function AddLayerDropdownMenu() {
  const {
    state: { template },
    updateTemplate,
    setCurrentLayerId,
  } = useTemplateEditorContext();

  function handleLayerTypeSelect(layerType: TemplateLayerType) {
    if (layerType !== 'color') return;

    const newLayer: TemplateLayerColor = {
      type: 'color',
      id: `new-layer-${template.layers.length + 1}`,
      name: 'Calque de couleur ' + (template.layers.length + 1),
      order: template.layers.length + 1,
      colorElements: [],
      config: {
        availableColors: [],
        columns: 5,
        space: 2,
        enableColorPalette: false,
        focus: {
          enable: false,
          message: 'Activer le focus',
          layerIdsToHide: [],
        },
      },
    };

    updateTemplate({ ...template, layers: [...template.layers, newLayer] });
    setCurrentLayerId(newLayer.id);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full">
          <Plus />
          Nouveau calque
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Type de calque</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {Object.entries(templateLayerTypes).map(([key, value]) => (
            <DropdownMenuItem
              key={key}
              onSelect={() => handleLayerTypeSelect(key as TemplateLayerType)}
            >
              {value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
