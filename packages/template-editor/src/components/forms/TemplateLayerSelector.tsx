import LayerIcon from '@/components/LayerIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.tsx';
import { cn } from '@clab/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

type TemplateLayerSelectorProps = {
  triggerClassName?: string;
  value: string[];
  onChange: (value: string[]) => void;
};

export default function TemplateLayerSelector({
  value,
  onChange,
  triggerClassName,
}: TemplateLayerSelectorProps) {
  const {
    state: {
      template: { layers },
      currentLayerId,
    },
  } = useTemplateEditorContext();

  const [open, setOpen] = useState<boolean>(false);

  function handleLayerSelect(layerId: string) {
    if (value.includes(layerId)) {
      onChange(value.filter((id) => id !== layerId));
    } else {
      onChange([...value, layerId]);
    }
    setOpen(false);
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
          <span className="line-clamp-1">
            {value.length
              ? layers
                  .filter((layer) => value.includes(layer.id))
                  .map((layer) => layer.name)
                  .join(', ')
              : 'Sélectionne les calques'}
          </span>

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
                  <CommandItem key={layer.id} value={layer.id} onSelect={handleLayerSelect}>
                    <LayerIcon type={layer.type} />
                    <div className="line-clamp-1">{layer.name}</div>
                    <Check
                      className={cn(
                        'ml-auto',
                        value.includes(layer.id) ? 'opacity-100' : 'opacity-0'
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
