import { Color } from '@/models/color.ts';
import { ColorElement, ColorGroup } from '@/models/template.ts';

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
