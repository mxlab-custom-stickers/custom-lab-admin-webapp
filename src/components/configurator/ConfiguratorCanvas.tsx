import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { brightenHexColor } from '@/lib/colors.ts';
import {
  collectColorItems,
  getAllColorItemsFromTemplate,
} from '@/lib/configurator.ts';
import { assignFabricObjectsToColorItemsInLayer } from '@/lib/fabric.ts';
import { cn } from '@/lib/utils.ts';
import { Canvas, loadSVGFromURL, Point } from 'fabric';
import { useEffect, useRef } from 'react';

type ConfiguratorCanvasProps = {
  wrapperClassName?: string;
};

export default function ConfiguratorCanvas({
  wrapperClassName,
}: ConfiguratorCanvasProps) {
  const {
    state: { template, canvas },
    updateTemplate,
    setCanvas,
    currentLayer,
    setCurrentColorElementId,
  } = useConfiguratorContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentLayer || currentLayer.type !== 'color' || !canvas) return;

    // Reset all color items to be non-interactive
    getAllColorItemsFromTemplate(template).forEach((colorItem) => {
      const objects = colorItem?.fabricObjects;
      if (!objects || objects.length === 0) return;

      objects.forEach((obj) => {
        obj.set({
          evented: false,
          perPixelTargetFind: false,
          targetFindTolerance: 0,
          hoverCursor: 'default',
        });
        obj.off();
      });
    });

    // Make color items in the current layer interactive
    collectColorItems(currentLayer.colorElements).forEach((colorItem) => {
      const objects = colorItem?.fabricObjects;
      if (!objects || objects.length === 0) return;

      objects.forEach((obj) => {
        obj.set({
          evented: true,
          perPixelTargetFind: true,
          targetFindTolerance: 0,
          hoverCursor: 'pointer',
        });

        const hoverColor = brightenHexColor(colorItem.color.value, 50);
        obj.on('mouseover', () => {
          objects.forEach((o) => {
            o.set('fill', hoverColor);
          });
          canvas.requestRenderAll();
        });

        obj.on('mouseout', () => {
          objects.forEach((o) => {
            o.set('fill', colorItem.color.value);
          });
          canvas.requestRenderAll();
        });

        obj.on('mousedown', () => {
          setCurrentColorElementId(colorItem.id);
        });
      });
    });
  }, [template.layers, currentLayer]);

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
      const { options } = svgData;
      const objects = svgData.objects.filter((obj) => obj !== null);

      objects.forEach((obj) => {
        obj.set({
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
        initCanvas.add(obj);
      });

      // Calculate scale to fit the canvas viewport
      const bounds = {
        width: options.width,
        height: options.height,
        left: 0,
        top: 0,
      };

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

      // cloneAllObjectsFromColorItemMap(
      //   filterMap(
      //     colorItemMap,
      //     (colorItem) => !['Selle'].includes(colorItem.id)
      //   )
      // ).then((clonedObjects) => {
      //   FabricImage.fromURL(MXlabLogo).then((img) => {
      //     const clipGroup = new Group(clonedObjects);
      //     clipGroup.set({
      //       absolutePositioned: true,
      //       selectable: false,
      //       evented: false,
      //       hasControls: false,
      //       hasBorders: false,
      //       lockMovementX: true,
      //       lockMovementY: true,
      //       lockScalingX: true,
      //       lockScalingY: true,
      //       lockRotation: true,
      //       visible: true,
      //       opacity: 0,
      //     });
      //
      //     initCanvas.add(clipGroup);
      //     initCanvas.sendObjectToBack(clipGroup);
      //
      //     img.set({
      //       absolutePositioned: true,
      //       clipPath: clipGroup,
      //       left: 0,
      //       top: -50,
      //     });
      //     initCanvas.add(img);
      //     initCanvas.bringObjectToFront(img);
      //     initCanvas.requestRenderAll();
      //
      //     initCanvas.on('object:added', () => {
      //       // Ensure the MXlab logo stays on top
      //       initCanvas.bringObjectToFront(img);
      //     });
      //   });
      // });

      const updatedTemplateColorLayers = template.layers
        .filter((layer) => layer.type === 'color')
        .map((layer) => assignFabricObjectsToColorItemsInLayer(layer, objects));

      const updatedTemplate = {
        ...template,
        layers: template.layers.map((layer) => {
          const updated = updatedTemplateColorLayers.find(
            (l) => l.id === layer.id
          );
          return updated ?? layer;
        }),
      };

      updateTemplate(updatedTemplate);

      getAllColorItemsFromTemplate(updatedTemplate).forEach((colorItem) => {
        const objects = colorItem?.fabricObjects;
        if (!objects || objects.length === 0) return;

        objects.forEach((obj) => {
          obj.set('fill', colorItem.color.value);
        });
      });

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
    <div ref={wrapperRef} className={cn('h-full w-full', wrapperClassName)}>
      <canvas
        id="configurator-canvas"
        ref={canvasRef}
        className="h-full w-full"
      />
    </div>
  );
}
