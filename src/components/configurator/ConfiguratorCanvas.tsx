import MXlabLogo from '@/assets/mxlab.png';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { getAllColorItems } from '@/lib/configurator.ts';
import { getFabricObjectsByIds } from '@/lib/fabric.ts';
import { cn } from '@/lib/utils.ts';
import {
  Canvas,
  FabricImage,
  FabricObject,
  loadSVGFromURL,
  Point,
  util,
} from 'fabric';
import { useEffect, useRef, useState } from 'react';

type ConfiguratorCanvasProps = {
  wrapperClassName?: string;
};

export default function ConfiguratorCanvas({
  wrapperClassName,
}: ConfiguratorCanvasProps) {
  const {
    state: { template, currentLayer },
    setCanvas,
    setCurrentFabricObjects,
  } = useConfiguratorContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [fabricObjects, setFabricObjects] = useState<FabricObject[]>([]);

  useEffect(() => {
    if (!currentLayer) {
      return;
    }

    const colorItemIds = getAllColorItems(currentLayer.colorElements).map(
      (ci) => ci.id
    );

    const currentFabricObjects = getFabricObjectsByIds(
      fabricObjects,
      colorItemIds
    );

    setCurrentFabricObjects(currentFabricObjects);
  }, [fabricObjects, currentLayer]);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const canvasEl = canvasRef.current;

    if (!wrapperEl || !canvasEl) {
      return;
    }

    const initCanvas = new Canvas(canvasEl);

    let width = wrapperEl.clientWidth;
    let height = wrapperEl.clientHeight;

    const resizeCanvas = () => {
      width = wrapperEl.clientWidth;
      height = wrapperEl.clientHeight;
      initCanvas.setWidth(width);
      initCanvas.setHeight(height);
    };
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    loadSVGFromURL(template.svgUrl).then((svgData) => {
      const { objects, options } = svgData;

      setFabricObjects(objects.filter((obj) => obj !== null));

      // Group all SVG elements
      const group = util.groupSVGElements(objects, options);

      // Disable interaction on the group
      group.set({
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

      initCanvas.add(group);
      initCanvas.sendObjectToBack(group);

      // Calculate scale to fit the canvas viewport
      const bounds = group.getBoundingRect();

      const scaleX = initCanvas.getWidth()! / bounds.width;
      const scaleY = initCanvas.getHeight()! / bounds.height;
      const scale = Math.min(scaleX, scaleY);

      // Reset viewport transform and apply scaling
      initCanvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);

      // Calculate translation to center the SVG
      const dx =
        initCanvas.getWidth()! / 2 - (bounds.left + bounds.width / 2) * scale;
      const dy =
        initCanvas.getHeight()! / 2 - (bounds.top + bounds.height / 2) * scale;
      initCanvas.relativePan(new Point(dx, dy));

      initCanvas.requestRenderAll();
    });

    // Zoom on mouse wheel
    initCanvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoom = initCanvas.getZoom();
      zoom *= 0.999 ** delta;

      // Clamp zoom
      zoom = Math.min(Math.max(zoom, 0.1), 10);

      initCanvas.zoomToPoint(
        new Point({ x: opt.e.offsetX, y: opt.e.offsetY }),
        zoom
      );
      opt.e.preventDefault();
      opt.e.stopPropagation();
      initCanvas.requestRenderAll();
    });

    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;

    initCanvas.on('mouse:down', (opt) => {
      if (opt.target) {
        isPanning = false;
        return;
      }
      isPanning = true;

      const e = opt.e;
      // Narrow to MouseEvent or PointerEvent
      if ('clientX' in e && 'clientY' in e) {
        lastPosX = (e as MouseEvent | PointerEvent).clientX;
        lastPosY = (e as MouseEvent | PointerEvent).clientY;
      } else {
        // Fallback for touch events (take first touch)
        const touchEvent = e as TouchEvent;
        if (touchEvent.touches && touchEvent.touches.length > 0) {
          lastPosX = touchEvent.touches[0].clientX;
          lastPosY = touchEvent.touches[0].clientY;
        }
      }

      initCanvas.selection = false;
    });

    initCanvas.on('mouse:move', (opt) => {
      if (!isPanning) return;

      const e = opt.e;

      let clientX: number | undefined;
      let clientY: number | undefined;

      if ('clientX' in e && 'clientY' in e) {
        clientX = (e as MouseEvent | PointerEvent).clientX;
        clientY = (e as MouseEvent | PointerEvent).clientY;
      } else {
        const touchEvent = e as TouchEvent;
        if (touchEvent.touches && touchEvent.touches.length > 0) {
          clientX = touchEvent.touches[0].clientX;
          clientY = touchEvent.touches[0].clientY;
        }
      }

      if (clientX === undefined || clientY === undefined) return;

      const vpt = initCanvas.viewportTransform!;
      vpt[4] += clientX - lastPosX;
      vpt[5] += clientY - lastPosY;
      initCanvas.requestRenderAll();

      lastPosX = clientX;
      lastPosY = clientY;
    });

    initCanvas.on('mouse:up', () => {
      isPanning = false;
      initCanvas.selection = true; // Re-enable selection
    });

    FabricImage.fromURL(MXlabLogo).then((img) => {
      img.set({
        left: 0,
        top: -50,
      });
      initCanvas.add(img);
      initCanvas.bringObjectToFront(img);
      initCanvas.requestRenderAll();
    });

    initCanvas.renderAll();
    setCanvas(initCanvas);

    // Expose the canvas instance to the global window object for debugging
    (window as any).__fabricCanvas = initCanvas;

    return () => {
      initCanvas.dispose();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cn('h-full w-full bg-white', wrapperClassName)}
    >
      <canvas
        id="configurator-canvas"
        ref={canvasRef}
        className="h-full w-full"
      />
    </div>
  );
}
