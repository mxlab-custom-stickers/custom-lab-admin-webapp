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

// Assuming `objects` is your array of FabricObjects
export function groupObjectsById(objects: FabricObject[]): Group[] {
  const idGroups: Record<string, FabricObject[]> = {};

  // Group objects by their `id` property
  for (const obj of objects) {
    const id = obj.get('id');
    if (!id) continue;

    if (!idGroups[id]) {
      idGroups[id] = [];
    }
    idGroups[id].push(obj);
  }

  // Convert each group of objects into a Fabric.Group
  return Object.entries(idGroups).map(([id, groupObjects]) => {
    const group = new Group(groupObjects, {
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
    });

    // Preserve the shared ID on the group
    group.set('id', id);

    return group;
  });
}
