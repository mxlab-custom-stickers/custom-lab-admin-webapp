import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { NumericInput } from '@/components/ui/NumericInput.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { useControlledState } from '@/hooks/use-controlled-state.ts';
import { RxLineHeight } from 'react-icons/rx';

type TextSpacingState = {
  charSpacing: number;
  lineHeight: number;
};

type TextSpacingPopoverProps = {
  value?: TextSpacingState;
  onValueChange?: (value: TextSpacingState) => void;
};

/**
 * A popover control to adjust letter spacing (charSpacing) and line height (lineHeight).
 * Useful for text formatting in editors or design tools.
 */
export default function TextSpacingPopover({
  value: valueProp,
  onValueChange,
}: TextSpacingPopoverProps) {
  const [value, setValue] = useControlledState(valueProp, onValueChange, {
    charSpacing: 0,
    lineHeight: 1,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <RxLineHeight className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8}>
        <div className="flex flex-col gap-4">
          {/* Char spacing */}
          <div className="space-y-2">
            <Label htmlFor="char-spacing-input" className="block">
              Espacement des lettres
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[value.charSpacing]}
                min={-200}
                max={800}
                onValueChange={(change) =>
                  setValue({ ...value, charSpacing: change[0] })
                }
              />
              <NumericInput
                id="char-spacing-input"
                className="no-spinner w-16 px-1 text-center"
                value={value.charSpacing}
                min={-200}
                max={800}
                step={50}
                onChange={(change) =>
                  setValue({ ...value, charSpacing: change })
                }
              />
            </div>
          </div>
          {/* Line height */}
          <div className="space-y-2">
            <Label htmlFor="line-height-input" className="block">
              Interligne
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[value.lineHeight]}
                min={0.1}
                max={2.5}
                step={0.1}
                onValueChange={(change) =>
                  setValue({ ...value, lineHeight: change[0] })
                }
              />
              <NumericInput
                id="line-height-input"
                className="no-spinner w-16 px-1 text-center"
                value={value.lineHeight}
                min={0.1}
                max={2.5}
                step={0.1}
                onChange={(change) =>
                  setValue({ ...value, lineHeight: change })
                }
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
