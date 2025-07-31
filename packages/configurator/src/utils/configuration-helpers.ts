import type { Configuration } from '@clab/types';

export function removeCanvasElementById(
  config: Configuration,
  layerId: string,
  elementId: string
): Configuration {
  const layer = config.layers.find((l) => l.id === layerId);
  if (!layer) {
    console.warn(`Cannot remove element: layer id ${layerId} not found`);
    return config;
  }

  switch (layer.type) {
    case 'image':
      return {
        ...config,
        layers: config.layers.map((l) => {
          if (l.id !== layerId || l.type !== 'image') return l;

          return {
            ...l,
            images: l.images.filter((image) => image.id !== elementId),
          };
        }),
      };
    default:
      console.warn(`Cannot remove element: unsupported layer type ${layer.type}`);
      return config;
  }
}
