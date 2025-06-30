import PositionPopover from '@/components/Toolbar/PositionPopover.tsx';
import TextSpacingPopover from '@/components/Toolbar/TextSpacingPopover.tsx';
import { Button } from '@/components/ui/button.tsx';
import NumberInput from '@/components/ui/NumberInput.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { Toggle } from '@/components/ui/toggle.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts';
import { useCanvas } from '@/hooks/use-canvas.ts';
import type { Text } from '@clab/types';
import { cn } from '@clab/utils';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  FlipHorizontal,
  FlipVertical,
  Italic,
} from 'lucide-react';
import React from 'react';

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 128;

export default function Toolbar({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { selectedObject, updateText, updateImage } = useConfiguratorContext();

  const { updateFabricText, updateFabricImage } = useCanvas();

  function updateTextProperty<K extends keyof Text>(key: K, value: Text[K]) {
    if (selectedObject?.type !== 'text') return;

    const { text } = selectedObject;

    // Update Fabric.js textbox if it exists
    const mappedKey = key === 'x' ? 'left' : key === 'y' ? 'top' : key;
    if (text.fabricTextbox) {
      updateFabricText(text.fabricTextbox, { [mappedKey]: value });
    }

    updateText({ ...text, [key]: value });
  }

  function updateImageProperty<K extends keyof Text>(key: K, value: Text[K]) {
    if (selectedObject?.type !== 'image') return;

    const { image } = selectedObject;

    // Update Fabric.js image if it exists
    const mappedKey = key === 'x' ? 'left' : key === 'y' ? 'top' : key;
    if (image.fabricImage) {
      updateFabricImage(image.fabricImage, { [mappedKey]: value });
    }

    updateImage({ ...image, [key]: value });
  }

  const isLocked =
    selectedObject?.type === 'image'
      ? selectedObject.image.locked
      : selectedObject?.type === 'text'
        ? selectedObject.text.locked
        : false;

  return selectedObject && !isLocked ? (
    <div
      className={cn(
        'absolute left-[calc(50%+(18rem/2))] top-4 z-50 flex h-11 -translate-x-1/2 items-center justify-center gap-2 rounded-md bg-[#323232dd] p-1 text-white shadow-xl',
        className
      )}
      {...props}
    >
      {/* Font size */}
      {selectedObject.type === 'text' ? (
        <NumberInput
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          step={2}
          value={selectedObject.text.fontSize}
          onValueChange={(value) => updateTextProperty('fontSize', value)}
        />
      ) : null}

      {/* Font weight */}
      {selectedObject.type === 'text' ? (
        <div className="flex items-center gap-1">
          <Toggle
            aria-label="Toggle bold"
            defaultPressed={selectedObject.text.fontWeight === 'bold'}
            onPressedChange={(pressed) =>
              updateTextProperty('fontWeight', pressed ? 'bold' : 'normal')
            }
          >
            <Bold className="h-5 w-5" />
          </Toggle>
          <Toggle
            aria-label="Toggle italic"
            defaultPressed={selectedObject.text.fontStyle === 'italic'}
            onPressedChange={(pressed) =>
              updateTextProperty('fontStyle', pressed ? 'italic' : 'normal')
            }
          >
            <Italic className="h-5 w-5" />
          </Toggle>
        </div>
      ) : null}

      {/* Text align */}
      {selectedObject.type === 'text' ? (
        <ToggleGroup
          className="gap-1 [&>button[data-slot=toggle-group-item]]:rounded-md"
          type="single"
          defaultValue={selectedObject.text.textAlign}
          onValueChange={(value) =>
            updateTextProperty('textAlign', value as 'left' | 'center' | 'right')
          }
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
      ) : null}

      {/* Text spacing */}
      {selectedObject.type === 'text' ? (
        <TextSpacingPopover
          value={{
            charSpacing: selectedObject.text.charSpacing,
            lineHeight: selectedObject.text.lineHeight,
          }}
          onValueChange={(value) => {
            updateTextProperty('charSpacing', value.charSpacing);
            updateTextProperty('lineHeight', value.lineHeight);
          }}
        />
      ) : null}

      {/* Image flip */}
      {selectedObject.type === 'image' ? (
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost">
            <FlipHorizontal />
          </Button>
          <Button size="icon" variant="ghost">
            <FlipVertical />
          </Button>
        </div>
      ) : null}

      <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />

      {/* Position */}
      {selectedObject.type === 'text' ? (
        <PositionPopover
          value={{
            x: selectedObject.text.x,
            y: selectedObject.text.y,
            width: selectedObject.text.width,
            height: selectedObject.text.height,
            angle: selectedObject.text.angle,
          }}
          onValueChange={(value) => {
            updateTextProperty('x', value.x);
            updateTextProperty('y', value.y);
            updateTextProperty('width', value.width);
            updateTextProperty('height', value.height);
            updateTextProperty('angle', value.angle);
          }}
        />
      ) : selectedObject.type === 'image' ? (
        <PositionPopover
          value={{
            x: selectedObject.image.x,
            y: selectedObject.image.y,
            width: selectedObject.image.width,
            height: selectedObject.image.height,
            angle: selectedObject.image.angle,
          }}
          onValueChange={(value) => {
            updateImageProperty('x', value.x);
            updateImageProperty('y', value.y);
            updateImageProperty('width', value.width);
            updateImageProperty('height', value.height);
            updateImageProperty('angle', value.angle);
          }}
        />
      ) : null}
    </div>
  ) : null;
}
