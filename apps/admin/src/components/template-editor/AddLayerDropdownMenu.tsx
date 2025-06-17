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
import { TemplateLayer, TemplateLayerType, templateLayerTypeLabels } from '@/models/template.ts';
import { Plus } from 'lucide-react';

export default function AddLayerDropdownMenu() {
  const {
    state: { template },
    updateTemplate,
    setCurrentLayerId,
  } = useTemplateEditorContext();

  function handleLayerTypeSelect(layerType: TemplateLayerType) {
    if (layerType === 'background') return;

    let newLayer: TemplateLayer;

    switch (layerType) {
      case 'color': {
        newLayer = {
          type: 'color',
          id: `color-layer-${template.layers.length + 1}`,
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
        break;
      }
      case 'image': {
        newLayer = {
          type: 'image',
          id: `image-layer-${template.layers.length + 1}`,
          name: `Calque d'image ${template.layers.length + 1}`,
          order: template.layers.length + 1,
          images: [],
          config: {
            availableImages: [],
            allowImport: true,
            clipWithLayerId: null,
            allowStretch: false,
          },
        };
        break;
      }
      case 'text': {
        newLayer = {
          type: 'text',
          id: `text-layer-${template.layers.length + 1}`,
          name: `Calque de texte ${template.layers.length + 1}`,
          order: template.layers.length + 1,
          texts: [],
          config: {
            availableColors: [],
            availableFonts: [],
          },
        };
        break;
      }
    }

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
          {Object.entries(templateLayerTypeLabels).map(([key, value]) => (
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
