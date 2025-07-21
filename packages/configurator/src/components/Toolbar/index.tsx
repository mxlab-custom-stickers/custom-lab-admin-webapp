import PositionPopover from '@/components/Toolbar/PositionPopover.tsx';
import TextSpacingPopover from '@/components/Toolbar/TextSpacingPopover.tsx';
import { Button } from '@/components/ui/button.tsx';
import NumberInput from '@/components/ui/NumberInput.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { Toggle } from '@/components/ui/toggle.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts';
import { useCanvas } from '@/hooks/use-canvas.ts';
import {
  isImageElement,
  isTextElement,
  type UpdatableCanvasElementProps,
  type UpdatableTextProps,
} from '@clab/types';
import { cn } from '@clab/utils';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  FlipHorizontal,
  FlipVertical,
  Italic,
  Type,
} from 'lucide-react';
import React from 'react';

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 128;

export default function Toolbar({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const {
    state: { sidebarView },
    selectedObject,
    setSidebarView,
    updateText,
    updateImage,
  } = useConfiguratorContext();
  if (!selectedObject) return null;

  const { updateFabricText, updateFabricObject } = useCanvas();

  function updateTextProperty<K extends keyof UpdatableTextProps>(
    key: K,
    value: UpdatableTextProps[K]
  ) {
    if (!selectedObject || !isTextElement(selectedObject)) return;

    if (selectedObject.fabricObject) {
      updateFabricText(selectedObject.fabricObject, { [key]: value });
    }
    updateText({ ...selectedObject, [key]: value });
  }

  // function updateImageProperty<K extends keyof UpdatableImageProps>(
  //   key: K,
  //   value: UpdatableImageProps[K]
  // ) {
  //   if (!selectedObject || !isImage(selectedObject)) return;
  //
  //   if (selectedObject.fabricObject) {
  //     updateFabricImage(selectedObject.fabricObject, { [mappedKey]: value });
  //   }
  //   updateImage({ ...selectedObject, [key]: value });
  // }

  function updateSharedProperty<K extends keyof UpdatableCanvasElementProps>(
    key: K,
    value: UpdatableCanvasElementProps[K]
  ) {
    if (!selectedObject) return;

    const mappedKey = key === 'x' ? 'left' : key === 'y' ? 'top' : key;
    if (selectedObject.fabricObject) {
      updateFabricObject(selectedObject.fabricObject, { [mappedKey]: value });
    }

    if (isImageElement(selectedObject)) {
      updateImage({ ...selectedObject, [key]: value });
    } else if (isTextElement(selectedObject)) {
      updateText({ ...selectedObject, [key]: value });
    }
  }

  return !selectedObject.locked ? (
    <div
      className={cn(
        'absolute left-[calc(50%+(18rem/2))] top-4 z-50 flex h-11 -translate-x-1/2 items-center justify-center gap-2 rounded-md bg-[#323232dd] p-1 text-white shadow-xl',
        className
      )}
      {...props}
    >
      {/* Selected Object is Text */}
      {isTextElement(selectedObject) ? (
        <>
          {/* Font */}
          <Toggle
            className="flex w-40 items-center justify-start text-base"
            pressed={sidebarView?.type === 'font-picker'}
            onPressedChange={(pressed) =>
              setSidebarView(pressed ? { type: 'font-picker' } : undefined)
            }
          >
            <Type />
            <div className="truncate">{selectedObject.font?.name || 'Police'}</div>
          </Toggle>

          {/* Font size */}
          <NumberInput
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={2}
            value={selectedObject.fontSize}
            onValueChange={(value) => updateTextProperty('fontSize', value)}
          />

          {/* Text and Stroke colors */}
          <Toggle
            pressed={sidebarView?.type === 'text-color-picker'}
            onPressedChange={(pressed) =>
              setSidebarView(pressed ? { type: 'text-color-picker' } : undefined)
            }
          >
            <Baseline className="!h-5 !w-5" />
          </Toggle>

          {/* Font weight and style */}
          <div className="flex items-center gap-1">
            <Toggle
              aria-label="Toggle bold"
              defaultPressed={selectedObject.fontWeight === 'bold'}
              onPressedChange={(pressed) =>
                updateTextProperty('fontWeight', pressed ? 'bold' : 'normal')
              }
            >
              <Bold className="h-5 w-5" />
            </Toggle>
            <Toggle
              aria-label="Toggle italic"
              defaultPressed={selectedObject.fontStyle === 'italic'}
              onPressedChange={(pressed) =>
                updateTextProperty('fontStyle', pressed ? 'italic' : 'normal')
              }
            >
              <Italic className="h-5 w-5" />
            </Toggle>
          </div>

          {/* Text align*/}
          <ToggleGroup
            className="gap-1 [&>button[data-slot=toggle-group-item]]:rounded-md"
            type="single"
            defaultValue={selectedObject.textAlign}
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

          {/* Text spacing */}
          <TextSpacingPopover
            value={{
              charSpacing: selectedObject.charSpacing,
              lineHeight: selectedObject.lineHeight,
            }}
            onValueChange={(value) => {
              updateTextProperty('charSpacing', value.charSpacing);
              updateTextProperty('lineHeight', value.lineHeight);
            }}
          />
        </>
      ) : null}

      {/* Selected Object is Image */}
      {isImageElement(selectedObject) ? (
        <>
          {/* Image flip */}
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost">
              <FlipHorizontal />
            </Button>
            <Button size="icon" variant="ghost">
              <FlipVertical />
            </Button>
          </div>
        </>
      ) : null}

      <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />

      {/* Shared properties */}
      {/* Position */}
      <PositionPopover
        value={{
          x: selectedObject.x,
          y: selectedObject.y,
          width: selectedObject.width,
          height: selectedObject.height,
          angle: selectedObject.angle,
        }}
        onValueChange={(value) => {
          updateSharedProperty('x', value.x);
          updateSharedProperty('y', value.y);
          updateSharedProperty('width', value.width);
          updateSharedProperty('height', value.height);
          updateSharedProperty('angle', value.angle);
        }}
      />
    </div>
  ) : null;
}
