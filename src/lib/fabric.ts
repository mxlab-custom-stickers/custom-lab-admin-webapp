import {
  ColorElement,
  ColorItem,
  TemplateLayerColor,
} from '@/models/template.ts';
import { Canvas, FabricObject } from 'fabric';

/**
 * Recursively updates ColorItems in a ColorElement tree by assigning matching FabricObjects
 * based on their ID.
 *
 * @param elements - An array of ColorElements (ColorItems or ColorGroups)
 * @param fabricObjects - Flat array of FabricObjects to associate by ID
 * @returns A new array of ColorElements with updated ColorItems
 */
function assignFabricObjectsToColorElements(
  elements: ColorElement[],
  fabricObjects: FabricObject[]
): ColorElement[] {
  return elements.map((element) => {
    if (element.type === 'group') {
      return {
        ...element,
        subColorElements: assignFabricObjectsToColorElements(
          element.subColorElements,
          fabricObjects
        ),
      };
    }

    const matchingObjects = fabricObjects.filter(
      (obj) => obj.get('id') === element.id
    );

    return {
      ...element,
      fabricObjects: matchingObjects,
    };
  });
}

/**
 * Populates all ColorItems in a TemplateLayerColor with their corresponding FabricObjects.
 * This works recursively for nested ColorGroups.
 *
 * @param layer - A TemplateLayerColor object containing nested ColorElements
 * @param fabricObjects - An array of FabricObjects to associate with ColorItems
 * @returns A new TemplateLayerColor with ColorItems enriched with their FabricObjects
 */
export function assignFabricObjectsToColorItemsInLayer(
  layer: TemplateLayerColor,
  fabricObjects: FabricObject[]
): TemplateLayerColor {
  const shapeObjects = fabricObjects.filter(isSvgShape);

  const updatedColorElements = assignFabricObjectsToColorElements(
    layer.colorElements,
    shapeObjects
  );

  return {
    ...layer,
    colorElements: updatedColorElements,
  };
}

/**
 * Determines whether the given FabricObject is a vector shape (not image, group, or text).
 *
 * @param obj - The FabricObject to check.
 * @returns True if the object is an SVG shape, false otherwise.
 */
export function isSvgShape(obj: FabricObject): boolean {
  const shapeTypes = [
    'path',
    'rect',
    'circle',
    'ellipse',
    'polygon',
    'polyline',
    'line',
  ];

  return shapeTypes.includes(obj.get('type'));
}

export function hideOrShowObjectsById(
  canvas: Canvas,
  ids: string[],
  hide: boolean
): void {
  canvas.getObjects().forEach((obj) => {
    const id = obj.get('id');
    if (ids.includes(id)) {
      obj.set('opacity', hide ? '0' : '1');
    }
  });

  canvas.requestRenderAll();
}

/**
 * Clone all FabricObjects inside the colorItemMap and return a flat array of clones.
 *
 * @param colorItemMap - Map of ColorItem to array of FabricObjects
 * @returns Promise resolving to an array of cloned FabricObjects
 */
export async function cloneAllObjectsFromColorItemMap(
  colorItemMap: Map<ColorItem, FabricObject[]>
): Promise<FabricObject[]> {
  const clonedObjectsArrays = await Promise.all(
    Array.from(colorItemMap.values()).map((objects) =>
      Promise.all(objects.map((obj) => obj.clone()))
    )
  );

  // Flatten the array of arrays into a single array of cloned objects
  return clonedObjectsArrays.flat();
}
