import { FabricImage } from 'fabric';
import { CanvasObject } from './canvas';

export interface Image extends CanvasObject<FabricImage> {
  id: string;
  type: 'image';

  name: string;
  url: string; // URL of the image
}

export type UpdatableImageProps = {};
