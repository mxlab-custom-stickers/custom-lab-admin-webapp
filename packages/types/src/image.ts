import { FabricImage } from 'fabric';
import { CanvasElement } from './canvas';

export interface Image extends CanvasElement<FabricImage> {
  id: string;
  type: 'image';

  name: string;
  url: string; // URL of the image
}

export type UpdatableImageProps = {};
