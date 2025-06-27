import { type Canvas, type FabricObject } from 'fabric';
import { useEffect, useState } from 'react';

interface FloatingPos {
  x: number;
  y: number;
}

export function useFloatingFabricControls(canvas: Canvas | null, offset = 75) {
  const [pos, setPos] = useState<FloatingPos | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!canvas) return;

    const getTopEdgeCenter = (obj: FabricObject) => {
      const zoom = canvas.getZoom();
      const viewport = canvas.viewportTransform;
      const canvasRect = canvas.getElement().getBoundingClientRect();

      const bounds = obj.aCoords; // absolute, transformed coordinates
      if (!bounds) return null;

      const topMidX = (bounds.tl.x + bounds.tr.x) / 2;
      const topMidY = (bounds.tl.y + bounds.tr.y) / 2;

      const screenX = topMidX * zoom + (viewport?.[4] ?? 0) + canvasRect.left;
      const screenY = topMidY * zoom + (viewport?.[5] ?? 0) + canvasRect.top;

      return { x: screenX, y: screenY - offset }; // move above top edge
    };

    const update = () => {
      const active = canvas.getActiveObject();
      if (!active) {
        setVisible(false);
        setPos(null);
        return;
      }

      const position = getTopEdgeCenter(active);
      if (position) {
        setPos(position);
        setVisible(true);
      }
    };

    const clear = () => {
      setVisible(false);
      setPos(null);
    };

    canvas.on('selection:created', update);
    canvas.on('selection:updated', update);
    canvas.on('object:modified', update);
    canvas.on('after:render', update);
    canvas.on('selection:cleared', clear);

    return () => {
      canvas.off('selection:created', update);
      canvas.off('selection:updated', update);
      canvas.off('object:modified', update);
      canvas.off('after:render', update);
      canvas.off('selection:cleared', clear);
    };
  }, [canvas, offset]);

  return { pos, visible };
}
