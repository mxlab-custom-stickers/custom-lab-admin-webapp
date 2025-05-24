import type { FabricObject } from 'fabric';

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
