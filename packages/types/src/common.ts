import { FabricObject } from 'fabric';

export type Status = 'active' | 'inactive' | 'archived';

export type CanvasObjectType = 'text' | 'image' | 'shape';

export interface CanvasObjectBase {
  id: string; // Unique identifier for the object

  type: CanvasObjectType;

  width: number;
  height: number;
  x: number;
  y: number;
  angle: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;

  fabricObject: FabricObject;
}

export interface CanvasObjectText extends CanvasObjectBase {
  type: 'text';

  text: string; // The text content
  fontFamily: string; // Font family name
  fontSize: number; // Font size in pixels
  fontWeight: string; // Font weight (e.g., 'normal', 'bold')
  fontStyle: string; // Font style (e.g., 'normal', 'italic')
  textAlign: 'left' | 'center' | 'right'; // Text alignment
  charSpacing: number; // Character spacing in pixels
  lineHeight: number; // Line height in pixels
}
