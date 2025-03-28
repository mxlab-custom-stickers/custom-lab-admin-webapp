import { SvgLayer } from '@/models/svg.ts';
import { Element, SVG } from '@svgdotjs/svg.js';

export function getSvgLayers(element: Element): SvgLayer[] {
  return Array.from(element.children())
    .filter((child) => child.children().length > 0)
    .map((child) => {
      const color =
        child.first().type !== 'g' ? child.first().attr('fill') : undefined;

      return {
        id: child.id(),
        type: child.type,
        color,
        children: getSvgLayers(child),
      };
    });
}

/**
 * Focus on a specific element in the SVG
 * Set the opacity of all other elements to 0.1
 * @param svgId The ID of the SVG containing the element
 * @param elementId The ID of the element to focus on
 */
export function focusElement(svgId: string, elementId: string) {
  const svgElement = SVG(`#${svgId}`);
  const targetElement = SVG(`#${svgId} #${elementId}`);

  if (!svgElement || !targetElement) return;

  svgElement.children()?.forEach((child) => {
    recursiveFocus(child, targetElement);
  });
}

function recursiveFocus(element: Element, targetElement: Element) {
  if (element.id() === targetElement.id()) {
    return;
  } else if (
    Array.from(targetElement.parents())?.find((p) => p.id() === element.id())
  ) {
    element.children()?.forEach((child) => {
      recursiveFocus(child, targetElement);
    });
  } else {
    element.css('opacity', '0.05');
  }
}

/**
 * Unfocus all elements in the SVG
 * Set the opacity of all elements to 1
 * @param svgId The ID of the SVG to unfocus
 */
export function unfocusElement(svgId: string) {
  const svgElement = SVG(`#${svgId}`);
  if (!svgElement) return;

  svgElement.children()?.forEach((child) => {
    recursiveUnfocus(child);
  });
}

function recursiveUnfocus(element: Element) {
  element.css('opacity', '1');
  element.children()?.forEach((child) => {
    recursiveUnfocus(child);
  });
}
