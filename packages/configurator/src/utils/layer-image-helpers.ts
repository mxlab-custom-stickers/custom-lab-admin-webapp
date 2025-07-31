import type { FileNode } from '@clab/firebase';
import type { Configuration, Image } from '@clab/types';
import { generateId } from '@clab/utils';

export function createImageFromFile(
  file: FileNode,
  layerId: string,
  defaultPos: { x: number; y: number } = { x: 0, y: 0 }
): Image {
  return {
    type: 'image',
    id: `${file.name}-${generateId()}`,
    layerId,

    name: file.name,
    url: file.url,

    x: defaultPos.x,
    y: defaultPos.y,
    angle: 0,
    width: 300,
    height: 300,

    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,

    locked: false,
  };
}

export function addImage(config: Configuration, image: Image): Configuration {
  return {
    ...config,
    layers: config.layers.map((layer) => {
      if (layer.id !== image.layerId || layer.type !== 'image') return layer;

      return {
        ...layer,
        images: [...layer.images, image],
      };
    }),
  };
}

export function updateImage(config: Configuration, updates: Image): Configuration {
  return {
    ...config,
    layers: config.layers.map((layer) => {
      if (layer.id !== updates.layerId || layer.type !== 'image') return layer;

      return {
        ...layer,
        images: layer.images.map((image) => (image.id === updates.id ? { ...updates } : image)),
      };
    }),
  };
}
