import { useControlledState } from '@/hooks/use-controlled-state.ts';
import { cn } from '@/lib/utils.ts';
import { Font } from '@/models/text.ts';
import { Check } from 'lucide-react';

type FontPickerProps = {
  fonts: Font[];
  value?: Font;
  onValueChange?: (value: Font) => void;
};

export default function FontPicker({ fonts, value: valueProp, onValueChange }: FontPickerProps) {
  const [value, setValue] = useControlledState<Font>(valueProp, onValueChange, undefined);

  return (
    <div className="flex flex-col">
      {fonts.map((font) => (
        <div
          key={font.id}
          className={cn(
            'flex cursor-pointer select-none items-center rounded-md p-1 px-2 text-lg hover:bg-gray-100'
          )}
          style={{ fontFamily: font.name }}
          onClick={() => setValue(font)}
        >
          {/* Font name */}
          <div className="line-clamp-1 flex-1 pr-1">{font.name}</div>
          {/* Check icon if selected */}
          {font.id === value?.id ? <Check /> : null}
        </div>
      ))}
    </div>
  );
}
