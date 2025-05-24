import { Color } from '@/models/color.ts';
import { ColorElement, ColorGroup, ColorItem } from '@/models/template.ts';

export function getAllColorGroupColors(colorGroup: ColorGroup): Color[] {
  return colorGroup.subColorElements.reduce<Color[]>((acc, child) => {
    if (child.type === 'item') {
      return [...acc, child.color];
    }
    return [...acc, ...getAllColorGroupColors(child)];
  }, []);
}

export function findColorElementById(
  colorElements: ColorElement[],
  id: string
): ColorElement | undefined {
  for (const element of colorElements) {
    if (element.id === id) {
      return element;
    }
    if (element.type === 'group') {
      const found = findColorElementById(element.subColorElements, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * Recursively updates a ColorElement by id in a nested ColorElement array.
 *
 * @param elements - The array of ColorElements to update.
 * @param id - The id of the ColorElement to update.
 * @param updater - A function that receives the matched element and returns the updated element.
 * @returns A new array with the updated ColorElement, preserving structure.
 */
export function updateColorElementById(
  elements: ColorElement[],
  id: string,
  updater: (element: ColorElement) => ColorElement
): ColorElement[] {
  return elements.map((el) => {
    if (el.id === id) {
      return updater(el);
    }
    if (el.type === 'group') {
      return {
        ...el,
        subColorElements: updateColorElementById(
          el.subColorElements,
          id,
          updater
        ),
      };
    }
    return el;
  });
}

export function updateColorElement(
  colorElements: ColorElement[],
  updatedElement: ColorElement
): ColorElement[] {
  return colorElements.map((element) => {
    if (element.id === updatedElement.id) {
      return updatedElement;
    }
    if (element.type === 'group') {
      return {
        ...element,
        subColorElements: updateColorElement(
          element.subColorElements,
          updatedElement
        ),
      } as ColorGroup;
    }
    return element;
  });
}

/**
 * Recursively extracts all ColorItem elements from a nested array of ColorElement.
 *
 * @param {ColorElement[]} elements - The array of ColorElement to search within.
 * @returns {ColorItem[]} An array of all ColorItem found in the nested structure.
 */
export function getAllColorItems(elements: ColorElement[]): ColorItem[] {
  const result: ColorItem[] = [];

  function recurse(elements: ColorElement[]) {
    for (const el of elements) {
      if (el.type === 'item') {
        result.push(el);
      } else if (el.type === 'group') {
        recurse(el.subColorElements);
      }
    }
  }

  recurse(elements);

  return result;
}
