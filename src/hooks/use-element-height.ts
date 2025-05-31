import { useEffect, useState } from 'react';

/**
 * Custom React hook that returns the current height (in pixels)
 * of a DOM element identified by its `id`. It updates automatically
 * when the element resizes.
 *
 * @param {string} id - The DOM element ID to observe.
 * @returns {number | null} The height of the element in pixels, or null if not found.
 *
 * @example
 * const headerHeight = useElementHeight('my-header');
 * return <div style={{ paddingTop: headerHeight ?? 0 }}>Content</div>;
 */
export function useElementHeight(id: string): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;

    const updateHeight = () => setHeight(element.clientHeight);
    updateHeight(); // Set initial height

    const observer = new ResizeObserver(() => updateHeight());
    observer.observe(element);

    return () => observer.disconnect();
  }, [id]);

  return height;
}
