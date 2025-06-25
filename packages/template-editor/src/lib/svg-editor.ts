import type { SvgLayer } from '@/types/svg-editor.ts';
import type { ColorElement } from '@clab/types';
import { Element, SVG } from '@svgdotjs/svg.js';

export function svgLayerToColorElement(svgLayer: SvgLayer): ColorElement {
  const base = {
    id: svgLayer.id,
    name: svgLayer.id,
  };

  if (svgLayer.color && svgLayer.color !== 'none') {
    return {
      ...base,
      type: 'item',
      parentId: svgLayer.parentId,
      color: { id: '', name: '', value: svgLayer.color },
    };
  }

  return {
    ...base,
    type: 'group',
    parentId: svgLayer.parentId,
    subColorElements: svgLayer.children?.map((child) => svgLayerToColorElement(child)) || [],
  };
}

/**
 * Recursively extracts a hierarchical structure of SVG elements from a given SVG root element.
 *
 * This function traverses the DOM tree starting from the given element, and constructs
 * an array of `SvgLayer` objects. Each layer includes its ID, type, optional fill color,
 * parent ID, and any child layers if present. Only elements with children are included.
 *
 * @param {Element} element - The root SVG element (e.g., a `<g>` or `<svg>`) to start the traversal from.
 * @returns {SvgLayer[]} An array of `SvgLayer` objects representing the nested structure of SVG elements.
 */
export function getSvgLayers(element: Element): SvgLayer[] {
  return Array.from(element.children())
    .filter((child) => child.children().length > 0)
    .map((child) => {
      const color = child.first().type !== 'g' ? child.first().attr('fill') : undefined;

      return {
        id: child.id(),
        type: child.type,
        color,
        parentId: element.id(),
        children: getSvgLayers(child),
      };
    });
}

/**
 * Resets opacity of all elements in the SVG to 1.
 *
 * @param {string} svgId - ID of the SVG element in the DOM.
 */
export function resetAllOpacity(svgId: string): void {
  const svgRoot = SVG(`#${svgId}`);
  svgRoot.children().forEach(resetOpacityRecursively);
}

/**
 * Sets the opacity of an element and all its descendants to 1.
 *
 * @param {Element} element - SVG element to reset.
 */
export function resetOpacityRecursively(element: Element): void {
  element.opacity(1);
  const children = element.children();
  for (const child of children) {
    resetOpacityRecursively(child);
  }
}

/**
 * Recursively updates the opacity of SVG elements:
 * - Elements in `selectedIds` → opacity 1
 * - Their descendants → opacity 1
 * - Others → opacity 0.3, **unless** they have selected descendants
 *
 * @param {string} svgId - ID of the SVG element in the DOM.
 * @param {string[]} selectedIds - Array of selected element IDs.
 */
export function updateOpacityRecursively(svgId: string, selectedIds: string[]): void {
  const svgRoot = SVG(`#${svgId}`);

  resetAllOpacity(svgId);

  if (selectedIds.length === 0) {
    return;
  }

  svgRoot.children().forEach((child) => internalUpdateOpacity(child, selectedIds));
}

/**
 * Internal helper: Recursively applies opacity logic to an SVG element.
 *
 * @param {Element} element - SVG element to process.
 * @param {string[]} selectedIds - IDs of selected elements.
 * @returns {boolean} - Whether this element or a descendant is selected.
 */
function internalUpdateOpacity(element: Element, selectedIds: string[]): boolean {
  const id = element.id();
  const children = element.children();

  const isSelected = id && selectedIds.includes(id);

  if (isSelected) {
    element.opacity(1);
    for (const child of children) {
      resetOpacityRecursively(child);
    }
    return true;
  }

  let hasSelectedDescendant = false;
  for (const child of children) {
    if (internalUpdateOpacity(child, selectedIds)) {
      hasSelectedDescendant = true;
    }
  }

  element.opacity(hasSelectedDescendant ? 1 : 0.3);
  return hasSelectedDescendant;
}

function flattenLayersWithParentId(layers: SvgLayer[], parentId: string | null = null): SvgLayer[] {
  return layers.flatMap((layer) => {
    const withParent: SvgLayer = { ...layer, parentId: parentId || undefined };

    if (!layer.children || layer.children.length === 0) {
      return [withParent];
    }

    return [withParent, ...flattenLayersWithParentId(layer.children, layer.id)];
  });
}

function getSiblingsExcludingSelf(layer: SvgLayer, layerMap: Map<string, SvgLayer>): string[] {
  if (!layer.parentId) return []; // no parent, no siblings

  const parent = layerMap.get(layer.parentId);
  if (!parent || !parent.children) return [];

  return parent.children.filter((child) => child.id !== layer.id).map((child) => child.id);
}

function getDescendantIds(layer: SvgLayer): string[] {
  if (!layer.children) return [];

  return layer.children.flatMap((child) => [child.id, ...getDescendantIds(child)]);
}

/**
 * Updates the selected layers when a new layer is selected, applying special logic:
 *
 * - If the parent of the selected layer is already selected:
 *    - Remove the parent from the selection.
 *    - Add all siblings of the selected layer except the selected layer itself.
 * - Otherwise, simply add the selected layer to the selection.
 *
 * This helps keep selections mutually exclusive between parent and children layers.
 *
 * @param selectedId - The ID of the layer being selected.
 * @param selectedLayers - The current array of selected layers.
 * @param rootLayers - The root layers array representing the full nested layer tree.
 *
 * @returns The updated array of selected SvgLayer objects after applying the selection logic.
 */
export function smartSelectLayer(
  selectedId: string,
  selectedLayers: SvgLayer[],
  rootLayers: SvgLayer[]
): SvgLayer[] {
  const flatLayers = flattenLayersWithParentId(rootLayers);
  const layerMap = new Map(flatLayers.map((l) => [l.id, l]));
  const selectedIdSet = new Set(selectedLayers.map((l) => l.id));

  const target = layerMap.get(selectedId);
  if (!target) return selectedLayers;

  const parentId = target.parentId;

  if (parentId && selectedIdSet.has(parentId)) {
    // Remove parent
    selectedIdSet.delete(parentId);

    // Add siblings
    const siblingIds = getSiblingsExcludingSelf(target, layerMap);
    for (const sibId of siblingIds) {
      selectedIdSet.add(sibId);
    }

    // Optional: add the selected item itself
    // selectedIdSet.add(selectedId);
  } else {
    selectedIdSet.add(selectedId);
  }

  // Map final selection back to full SvgLayer objects
  const result: SvgLayer[] = [];
  for (const id of selectedIdSet) {
    const layer = layerMap.get(id);
    if (layer) {
      result.push(layer);
    }
  }

  return result;
}

/**
 * Checks whether a given layer has a selected parent in the layer hierarchy.
 *
 * @param layer - The layer to check.
 * @param allLayers - The full tree of layers.
 * @param selectedLayers - The currently selected layers.
 * @returns True if any ancestor of the layer is selected, false otherwise.
 */
export function hasSelectedParent(
  layer: SvgLayer,
  allLayers: SvgLayer[],
  selectedLayers: SvgLayer[]
): boolean {
  if (!layer.parentId) return false;

  const selectedIds = new Set(selectedLayers.map((l) => l.id));
  const layerMap = new Map(flattenLayersWithParentId(allLayers).map((l) => [l.id, l]));

  let parentId: string | undefined = layer.parentId;

  while (parentId) {
    if (selectedIds.has(parentId)) return true;

    const parent = layerMap.get(parentId);
    if (!parent) break;

    parentId = parent.parentId;
  }

  return false;
}

/**
 * Updates the selection by adding the specified layer and removing all of its descendants
 * from the selected layers array.
 *
 * This ensures that when a parent layer is selected, none of its children or deeper descendants
 * remain selected, preventing conflicting selections in the hierarchy.
 *
 * @param selectedId - The ID of the layer being selected.
 * @param selectedLayers - The currently selected SvgLayer objects.
 * @param rootLayers - The full nested layer tree.
 * @returns The updated array of selected SvgLayer objects.
 */
export function selectLayerAndCleanDescendants(
  selectedId: string,
  selectedLayers: SvgLayer[],
  rootLayers: SvgLayer[]
): SvgLayer[] {
  const flatLayers = flattenLayersWithParentId(rootLayers);
  const layerMap = new Map(flatLayers.map((l) => [l.id, l]));

  const selectedLayer = layerMap.get(selectedId);
  if (!selectedLayer) return selectedLayers;

  const descendantIds = new Set(getDescendantIds(selectedLayer));
  const updatedSelection: SvgLayer[] = [];

  for (const layer of selectedLayers) {
    if (!descendantIds.has(layer.id)) {
      updatedSelection.push(layer);
    }
  }

  // Only add if it's not already in the result
  if (!updatedSelection.some((l) => l.id === selectedLayer.id)) {
    updatedSelection.push(selectedLayer);
  }

  return updatedSelection;
}

/**
 * Flattens a nested tree of SvgLayers into a flat array.
 */
export function flattenSvgLayers(layers: SvgLayer[]): SvgLayer[] {
  return layers.flatMap((layer) => [
    layer,
    ...(layer.children ? flattenSvgLayers(layer.children) : []),
  ]);
}
