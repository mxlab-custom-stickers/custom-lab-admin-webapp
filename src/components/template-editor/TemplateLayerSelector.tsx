import LayerIcon from '@/components/configurator/LayerIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils.ts';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export default function TemplateLayerSelector({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const {
    state: {
      template: { layers },
      currentLayerId,
    },
    currentLayer,
    updateLayer,
  } = useTemplateEditorContext();

  if (!currentLayer) return null;

  const {
    config: { focus },
  } = currentLayer;

  const [open, setOpen] = useState<boolean>(false);

  function handleLayerSelect(layerId: string) {
    if (!currentLayer) return;

    const isLayerAlreadyPresent = focus.layerIdsToHide.includes(layerId);
    const updatedLayerIdsToHide = isLayerAlreadyPresent
      ? focus.layerIdsToHide.filter((id) => id !== layerId)
      : [...focus.layerIdsToHide, layerId];

    updateLayer({
      ...currentLayer,
      config: {
        ...currentLayer.config,
        focus: {
          ...focus,
          layerIdsToHide: updatedLayerIdsToHide,
        },
      },
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={triggerClassName} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Sélectionne les calques
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Aucun autre calque trouvé.</CommandEmpty>
            <CommandGroup>
              {layers
                .filter((layer) => layer.id !== currentLayerId)
                .map((layer) => (
                  <CommandItem
                    key={layer.id}
                    value={layer.id}
                    onSelect={() => handleLayerSelect(layer.id)}
                  >
                    <LayerIcon type={layer.type} />
                    <div className="line-clamp-1">{layer.name}</div>
                    <Check
                      className={cn(
                        'ml-auto',
                        focus.layerIdsToHide.includes(layer.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
