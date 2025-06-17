import { Checkbox } from '@/components/ui/checkbox.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { cn } from '@/lib/utils.ts';
import { Font } from '@/models/text.ts';

type FontSelectorProps = {
  className?: string;
  fonts: Font[];
  selectedFonts: Font[];
  onChange: (fonts: Font[]) => void;
};

export default function FontSelector({
  className,
  fonts,
  selectedFonts,
  onChange,
}: FontSelectorProps) {
  function handleFontSelect(font: Font) {
    const changes = selectedFonts.some((f) => f.id === font.id)
      ? selectedFonts.filter((f) => f.id !== font.id)
      : [...selectedFonts, font];
    onChange(changes);
  }

  return (
    <ScrollArea className={cn('flex flex-1 flex-col gap-1 overflow-auto', className)}>
      <div className="flex flex-col gap-2 p-2 pr-3">
        {fonts.map((font) => (
          <div
            key={font.id}
            className={cn(
              'hover:bg-secondary group relative cursor-pointer select-none rounded-md p-3 pl-12',
              {
                'bg-secondary': selectedFonts.some((f) => f.id === font.id),
              }
            )}
            onClick={() => handleFontSelect(font)}
          >
            <Checkbox
              className="absolute left-4 top-1/2 -translate-y-1/2"
              checked={selectedFonts.some((f) => f.id === font.id)}
            />

            {/* Font name */}
            <div className="mb-1 whitespace-nowrap text-sm font-semibold group-hover:underline">
              {font.name}
            </div>
            {/* Font preview */}
            <div className="line-clamp-1 px-1 text-3xl" style={{ fontFamily: font.name }}>
              Custom Lab 2 by MXlab, the best configurator for your graphic kits.
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
