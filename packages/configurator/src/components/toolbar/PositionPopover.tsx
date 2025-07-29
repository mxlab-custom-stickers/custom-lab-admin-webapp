import { Button } from '@/components/ui/button.tsx';
import { NumericInput } from '@/components/ui/NumericInput.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { useControlledState } from '@/hooks/use-controlled-state.ts';

type PositionState = {
  x: number;
  y: number;
  angle: number;
  width: number;
  height: number;
};

type PositionPopoverProps = {
  value?: PositionState;
  onValueChange?: (value: PositionState) => void;
};

export default function PositionPopover({ value: valueProp, onValueChange }: PositionPopoverProps) {
  const [value, setValue] = useControlledState(valueProp, onValueChange, {
    x: 0,
    y: 0,
    angle: 0,
    width: 100,
    height: 100,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-base">
          Position
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8}>
        <div>
          <div className="grid grid-cols-3 gap-3">
            {/* X */}
            <div className="space-y-2">
              <label htmlFor="x-input" className="block text-sm font-medium">
                X
              </label>
              <NumericInput
                id="x-input"
                value={value.x}
                onChange={(change) => setValue({ ...value, x: change })}
              />
            </div>
            {/* Y */}
            <div className="space-y-2">
              <label htmlFor="y-input" className="block text-sm font-medium">
                Y
              </label>
              <NumericInput
                id="y-input"
                value={value.y}
                onChange={(change) => setValue({ ...value, y: change })}
              />
            </div>
            {/* Angle */}
            <div className="space-y-2">
              <label htmlFor="angle-input" className="block text-sm font-medium">
                Angle
              </label>
              <NumericInput
                id="angle-input"
                value={value.angle}
                onChange={(change) => setValue({ ...value, angle: change })}
                min={-360}
                max={360}
              />
            </div>
            {/* Width */}
            <div className="space-y-2">
              <label htmlFor="width-input" className="block text-sm font-medium">
                Largeur
              </label>
              <NumericInput
                id="width-input"
                value={value.width}
                onChange={(change) => setValue({ ...value, width: change })}
              />
            </div>
            {/* Height */}
            <div className="space-y-2">
              <label htmlFor="height-input" className="block text-sm font-medium">
                Hauteur
              </label>
              <NumericInput
                id="height-input"
                value={value.height}
                onChange={(change) => setValue({ ...value, height: change })}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
