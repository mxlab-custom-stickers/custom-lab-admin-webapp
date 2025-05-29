import { FabricImage } from 'fabric';

export interface Image {
  id: string;
  name: string;
  url: string; // URL of the image
  width: number; // Width of the image in pixels
  height: number; // Height of the image in pixels
  x: number; // X position of the image on the canvas
  y: number; // Y position of the image on the canvas
  angle: number; // Rotation angle of the image in degrees
  scaleX: number; // Scale factor in the X direction
  scaleY: number; // Scale factor in the Y direction

  fabricImage?: FabricImage;
}
