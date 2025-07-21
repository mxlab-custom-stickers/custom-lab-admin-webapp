import { FabricObject } from 'fabric';
import { Image } from './image';
import { Text } from './text';

export type CanvasElementType = 'image' | 'text';

/**
 * Represents an element on the canvas that can be selected, moved, resized, etc.
 * It can be an image or a text element.
 */
export interface CanvasElement<T extends FabricObject = FabricObject> {
  type: CanvasElementType;

  x: number;
  y: number;

  width: number;
  height: number;
  angle: number;

  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;

  locked: boolean;

  fabricObject?: T | null;
}

export type UpdatableCanvasElementProps = Partial<
  Pick<
    CanvasElement,
    'x' | 'y' | 'width' | 'height' | 'angle' | 'scaleX' | 'scaleY' | 'skewX' | 'skewY' | 'locked'
  >
>;

export function isCanvasElement(obj: unknown): obj is CanvasElement {
  if (typeof obj !== 'object' || obj === null) return false;

  const o = obj as Partial<CanvasElement>;

  return (
    (o.type === 'image' || o.type === 'text') &&
    typeof o.x === 'number' &&
    typeof o.y === 'number' &&
    typeof o.width === 'number' &&
    typeof o.height === 'number' &&
    typeof o.angle === 'number' &&
    typeof o.scaleX === 'number' &&
    typeof o.scaleY === 'number' &&
    typeof o.skewX === 'number' &&
    typeof o.skewY === 'number' &&
    typeof o.locked === 'boolean'
  );
}

export function isTextElement(obj: CanvasElement): obj is Text {
  return obj.type === 'text';
}

export function isImageElement(obj: CanvasElement): obj is Image {
  return obj.type === 'image';
}
