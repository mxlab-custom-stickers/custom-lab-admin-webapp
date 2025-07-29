import type { Canvas } from 'fabric';

export function updateFabricObjectsColor(canvas: Canvas, objectsId: string, color: string) {
  const objects = canvas.getObjects().filter((obj) => obj.get('id') === objectsId);

  if (!objects.length) {
    console.warn(`Object with id ${objectsId} is not a path. Color update skipped.`);
    return;
  }

  objects.forEach((obj) => {
    obj.set({
      fill: color,
    });
  });

  canvas.requestRenderAll();
}
