import PositionPopover from '@/components/configurator/Toolbar/PositionPopover.tsx';
import TextSpacingPopover from '@/components/configurator/Toolbar/TextSpacingPopover.tsx';
import NumberInput from '@/components/ui/NumberInput.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { Toggle } from '@/components/ui/toggle.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic } from 'lucide-react';

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 128;

export default function ToolbarTextEditor() {
  const {
    state: { canvas },
    currentText,
    updateText,
  } = useConfiguratorContext();

  if (!currentText) return null;

  function handleFontSizeChange(fontSize: number) {
    if (!currentText) return;

    if (fontSize <= MIN_FONT_SIZE || fontSize > MAX_FONT_SIZE) return;

    currentText?.fabricText?.set({ fontSize });
    canvas?.requestRenderAll();

    updateText({ ...currentText, fontSize });
  }

  function handleBoldChange(active: boolean) {
    if (!currentText) return;

    const fontWeight = active ? 'bold' : 'normal';

    currentText?.fabricText?.set({ fontWeight });
    canvas?.requestRenderAll();

    updateText({ ...currentText, fontWeight });
  }

  function handleItalicChange(active: boolean) {
    if (!currentText) return;

    const fontStyle = active ? 'italic' : 'normal';

    currentText?.fabricText?.set({ fontStyle });
    canvas?.requestRenderAll();

    updateText({ ...currentText, fontStyle });
  }

  function handleTextAlignChange(textAlign: 'left' | 'center' | 'right') {
    if (!currentText) return;

    currentText?.fabricText?.set({ textAlign });
    canvas?.requestRenderAll();

    updateText({ ...currentText, textAlign });
  }

  function handleTextSpacingChange(charSpacing: number, lineHeight: number) {
    if (!currentText) return;

    currentText?.fabricText?.set({ charSpacing, lineHeight });
    canvas?.requestRenderAll();

    updateText({ ...currentText, charSpacing, lineHeight });
  }

  function handlePositionChange(
    x: number,
    y: number,
    angle: number,
    width: number,
    height: number
  ) {
    if (!currentText) return;

    currentText?.fabricText?.set({ left: x, top: y, angle, width, height });
    canvas?.requestRenderAll();

    updateText({ ...currentText, x, y, angle, width, height });
  }

  return (
    <div className="flex w-full items-center justify-center gap-2">
      {/* Font size */}
      <NumberInput
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        step={2}
        value={currentText.fontSize}
        onValueChange={handleFontSizeChange}
      />

      {/* Font weight and style */}
      <div className="flex items-center gap-1">
        <Toggle
          aria-label="Toggle bold"
          defaultPressed={currentText.fontWeight === 'bold'}
          onPressedChange={handleBoldChange}
        >
          <Bold className="h-5 w-5" />
        </Toggle>
        <Toggle
          aria-label="Toggle italic"
          defaultPressed={currentText.fontStyle === 'italic'}
          onPressedChange={handleItalicChange}
        >
          <Italic className="h-5 w-5" />
        </Toggle>
      </div>

      {/* Text align */}
      <ToggleGroup
        className="gap-1 [&>button[data-slot=toggle-group-item]]:rounded-md"
        type="single"
        defaultValue={currentText.textAlign}
        onValueChange={handleTextAlignChange}
      >
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeft className="h-5 w-5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter className="h-5 w-5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRight className="h-5 w-5" />
        </ToggleGroupItem>
      </ToggleGroup>

      <TextSpacingPopover
        value={{
          charSpacing: currentText.charSpacing,
          lineHeight: currentText.lineHeight,
        }}
        onValueChange={(changes) =>
          handleTextSpacingChange(changes.charSpacing, changes.lineHeight)
        }
      />

      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />

      {/* Position */}
      <PositionPopover
        value={{
          x: currentText.x,
          y: currentText.y,
          angle: currentText.angle,
          width: currentText.width,
          height: currentText.height,
        }}
        onValueChange={(changes) =>
          handlePositionChange(
            changes.x,
            changes.y,
            changes.angle,
            changes.width,
            changes.height
          )
        }
      />
    </div>
  );
}
