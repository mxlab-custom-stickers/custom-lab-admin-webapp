import { FabricObject } from 'fabric';
import { Image } from './image';
import { Text } from './text';

export type CanvasObjectType = 'image' | 'text';

export interface CanvasObject<T extends FabricObject = FabricObject> {
  type: CanvasObjectType;

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

export type UpdatableCanvasObjectProps = Partial<
  Pick<
    CanvasObject,
    'x' | 'y' | 'width' | 'height' | 'angle' | 'scaleX' | 'scaleY' | 'skewX' | 'skewY' | 'locked'
  >
>;

export function isText(obj: CanvasObject): obj is Text {
  return obj.type === 'text';
}

export function isImage(obj: CanvasObject): obj is Image {
  return obj.type === 'image';
}
