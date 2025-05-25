import { getAllColorItemsFromTemplate } from '@/lib/configurator.ts';
import { ColorItem, Template } from '@/models/template.ts';
import { FabricObject, Group } from 'fabric';

/**
 * Filters a list of FabricObjects to include only those whose `id` matches
 * one of the specified group IDs.
 *
 * @param fabricObjects - An array of FabricObject instances parsed from an SVG.
 * @param ids - An array of `id` strings to match against the FabricObjects.
 * @returns An array of FabricObjects whose `id` property matches any of the provided IDs.
 */
export function getFabricObjectsByIds(
  fabricObjects: FabricObject[],
  ids: string[]
): FabricObject[] {
  const idSet = new Set(ids);

  return fabricObjects.filter((obj) => {
    const id = obj.get('id');
    return typeof id === 'string' && idSet.has(id);
  });
}

export function getColorItemMap(
  template: Template,
  objects: FabricObject[]
): Map<ColorItem, FabricObject[]> {
  const colorItemMap = new Map<ColorItem, FabricObject[]>();

  // Only include SVG shape objects (e.g., path, rect, etc.)
  const shapeObjects = objects.filter(isSvgShape);

  // Collect all color items from the template
  const colorItems = getAllColorItemsFromTemplate(template);

  // Associate each ColorItem with its corresponding FabricObjects
  colorItems.forEach((colorItem) => {
    const matchingShapes = shapeObjects.filter(
      (obj) => obj.get('id') === colorItem.id
    );
    if (matchingShapes.length) {
      colorItemMap.set(colorItem, matchingShapes);
    }
  });

  return colorItemMap;
}

/**
 * Groups FabricObjects that share the same 'id' property into Group instances,
 * and sets the group's 'id' property to that shared id.
 *
 * @param objects - Array of FabricObjects to group.
 * @returns Array of Group, each grouping objects with the same id and carrying that id.
 */
export function groupObjectsById(objects: FabricObject[]): Group[] {
  const groupsMap = new Map<string, FabricObject[]>();

  for (const obj of objects) {
    const id = obj.get('id');
    if (!id) continue;

    if (!groupsMap.has(id)) {
      groupsMap.set(id, []);
    }
    groupsMap.get(id)!.push(obj);
  }

  const groups: Group[] = [];

  for (const [id, objs] of groupsMap.entries()) {
    const group = new Group(objs);
    group.set('id', id);
    groups.push(group);
  }

  return groups;
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
