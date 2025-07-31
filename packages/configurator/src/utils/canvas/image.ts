import type { Image } from '@clab/types';
import { type Canvas, FabricImage } from 'fabric';

export async function drawImage(canvas: Canvas, image: Image): Promise<FabricImage> {
  const fabricImage = await FabricImage.fromURL(image.url);

  fabricImage.set({
    id: image.id,
    name: image.name,
    left: image.x,
    top: image.y,
    angle: image.angle,
    scaleX: image.scaleX,
    scaleY: image.scaleY,
    skewX: image.skewX,
    skewY: image.skewY,
    absolutePositioned: true,
    layerId: image.layerId,
  });

  fabricImage.setControlsVisibility({
    mt: false,
    ml: false,
    mr: false,
    mb: false,
  });

  canvas.add(fabricImage);
  canvas.requestRenderAll();

  return fabricImage;
}

export function activateImage(
  canvas: Canvas,
  image: Image,
  callbacks: { onModified: (modifiedImage: Image) => void }
): void {
  const obj = canvas.getObjects().find((o) => o.get('id') === image.id);
  if (!obj) {
    console.error(`Can't activate object with id '${image.id}': not found on canvas`);
    return;
  }

  obj.set({
    selectable: true,
    evented: true,
  });

  obj.on('modified', (e) => {
    if (!e.transform) return;
    const {
      transform: { target },
    } = e;

    const updatedImage = {
      ...image,
      x: target.left,
      y: target.top,
      angle: target.angle,
      scaleX: target.scaleX,
      scaleY: target.scaleY,
    };

    console.debug(`Image with id '${image.id}' modified`);
    callbacks.onModified(updatedImage);
  });
}
