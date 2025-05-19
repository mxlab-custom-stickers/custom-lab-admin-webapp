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
import { useConfiguratorContext } from '@/contexts/configurator-context.ts';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.ts';
import {
  TemplateLayerColor,
  TemplateLayerType,
  templateLayerTypes,
} from '@/models/template.ts';
import { Plus } from 'lucide-react';

export default function NewLayerDropdownMenu() {
  const { showSvgLayerPicker, setShowSvgLayerPicker } =
    useTemplateEditorContext();

  const { template, setTemplate, setCurrentLayer } = useConfiguratorContext();

  function handleLayerTypeSelect(layerType: TemplateLayerType) {
    if (layerType !== 'color') return;

    const newLayer: TemplateLayerColor = {
      type: 'color',
      id: 'new-layer',
      name: 'Nouveau calque',
      order: template.layers.length + 1,
      colorElements: [],
      config: {
        availableColorPalettes: [],
        availableColors: [],
        columns: 5,
        space: 2,
      },
    };

    setShowSvgLayerPicker(true);
    setTemplate({ ...template, layers: [...template.layers, newLayer] });
    setCurrentLayer(newLayer);
  }

  return !showSvgLayerPicker ? (
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
  ) : null;
}
