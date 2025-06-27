import { Button } from '@/components/ui/button.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useFloatingFabricControls } from '@/hooks/use-floating-fabric-controls.ts';
import {
  clipImageLayerToColorLayer,
  drawImageOnCanvas,
  drawTextOnCanvas,
  makeColorItemInteractive,
  makeImageInteractive,
  makeTextInteractive,
  renderSVGToCanvas,
  resetInteractivity,
  resizeCanvasToWrapper,
  setupZoomAndPan,
} from '@/lib/fabric.ts';
import type { Template, TemplateLayerImage, Text } from '@clab/types';
import {
  assignFabricObjectsToColorItemsInLayer,
  cn,
  collectColorItems,
  getAllColorItemsFromTemplate,
  getAllImagesFromTemplate,
  getAllTextsFromTemplate,
  updateImagesInTemplate,
  updateTextsInTemplate,
} from '@clab/utils';
import * as fabric from 'fabric';
import { Canvas } from 'fabric';
import { CopyPlus, LockOpen, Trash } from 'lucide-react';
import { useEffect, useRef } from 'react';

type ConfiguratorCanvasProps = {
  wrapperClassName?: string;
};

export default function ConfiguratorCanvas({ wrapperClassName }: ConfiguratorCanvasProps) {
  const {
    state: { template, canvas, currentLayerId },
    updateTemplate,
    setCanvas,
    currentLayer,
    setCurrentColorElementId,
    setSelectedObjectId,
  } = useConfiguratorContext();

  const { pos, visible } = useFloatingFabricControls(canvas || null);

  const templateRef = useRef<Template>(template);

  useEffect(() => {
    templateRef.current = template;
  }, [template]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentLayer || !canvas) return;

    requestAnimationFrame(() => {
      if (canvas.getObjects().length === 0) return;

      resetInteractivity(template);

      if (currentLayer.type === 'color') {
        // Activate interactivity for color items
        collectColorItems(currentLayer.colorElements).forEach((colorItem) => {
          makeColorItemInteractive(colorItem, canvas, setCurrentColorElementId);
        });
      } else if (currentLayer.type === 'image') {
        // Activate interactivity for images
        currentLayer.images.forEach((image) =>
          makeImageInteractive(
            image,
            (selected) => {
              setSelectedObjectId(selected ? image.id : undefined);
            },
            (modifiedImage) => {
              const updatedTemplate = updateImagesInTemplate(templateRef.current, [modifiedImage]);
              updateTemplate(updatedTemplate);
            }
          )
        );
      } else if (currentLayer.type === 'text') {
        // Activate interactivity for text objects
        currentLayer.texts.forEach((text) => {
          makeTextInteractive(
            text,
            (selected) => {
              setSelectedObjectId(selected ? text.id : undefined);
            },
            (modifiedText) => {
              const updatedTemplate = updateTextsInTemplate(templateRef.current, [modifiedText]);
              updateTemplate(updatedTemplate);
            }
          );
        });
      }

      canvas.requestRenderAll();
    });
  }, [template.layers, currentLayerId]);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapperEl || !canvasEl) return;

    const initCanvas = new Canvas(canvasEl);

    const controlsColor = 'oklch(70.7% 0.165 254.624)';
    fabric.InteractiveFabricObject.ownDefaults = {
      ...fabric.InteractiveFabricObject.ownDefaults,
      cornerStrokeColor: controlsColor,
      cornerColor: controlsColor,
      borderColor: controlsColor,
      transparentCorners: false,
      padding: 0,
    };

    const resize = () => resizeCanvasToWrapper(initCanvas, wrapperEl);
    resize();
    window.addEventListener('resize', resize);

    setupZoomAndPan(initCanvas);

    // Initialize the canvas with the template data
    const init = async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      let updatedTemplate;

      // Draw the SVG template onto the canvas
      const objects = await renderSVGToCanvas(initCanvas, template.svgUrl);
      // Assign the fabric objects to color items in the template layers
      const updatedColorLayers = template.layers.map((layer) =>
        layer.type === 'color' ? assignFabricObjectsToColorItemsInLayer(layer, objects) : layer
      );

      updatedTemplate = { ...templateRef.current, layers: updatedColorLayers };

      // Update the fabric objects with the color items colors
      getAllColorItemsFromTemplate(updatedTemplate).forEach((item) => {
        item.fabricObjects?.forEach((obj) => obj.set('fill', item.color.value));
      });

      // Draw all the template images on the canvas and assign them to their respective fabric images
      const images = await Promise.all(
        getAllImagesFromTemplate(updatedTemplate).map(async (image) =>
          drawImageOnCanvas(initCanvas, image)
        )
      );
      updatedTemplate = updateImagesInTemplate(updatedTemplate, images);

      // Draw all the texts on the canvas and assign them to their respective fabric text objects
      const texts: Text[] = getAllTextsFromTemplate(updatedTemplate).map((text) => ({
        ...text,
        fabricTextbox: drawTextOnCanvas(initCanvas, text),
      }));
      updatedTemplate = updateTextsInTemplate(updatedTemplate, texts);

      // Clip image layers with corresponding color layers if specified in their config
      await Promise.all(
        (
          updatedTemplate.layers.filter(
            (layer) => layer.type === 'image' && layer.config.clipWithLayerId !== null
          ) as TemplateLayerImage[]
        ).map((layer) => {
          const clipWithLayer = updatedTemplate.layers.find(
            (l) => l.id === layer.config.clipWithLayerId
          );
          if (!clipWithLayer || clipWithLayer.type !== 'color') return;
          return clipImageLayerToColorLayer(initCanvas, layer, clipWithLayer);
        })
      );

      return updatedTemplate;
    };

    init().then((updatedTemplate) => {
      updateTemplate(updatedTemplate);
      initCanvas.renderAll();
      setCanvas(initCanvas);
    });

    // Expose the canvas instance to the global window object for debugging
    (window as any).__fabricCanvas = initCanvas;

    return () => {
      initCanvas?.dispose();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cn('relative h-full w-full', wrapperClassName)}>
      <canvas id="configurator-canvas" ref={canvasRef} className="h-full w-full" />
      {visible && pos && (
        <div
          className="absolute flex gap-0 rounded-md bg-white/90 p-1 shadow-lg"
          style={{
            top: pos.y,
            left: pos.x,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'auto',
          }}
        >
          <Button
            className="aspect-square !p-1 hover:!bg-gray-100 hover:!text-black"
            variant="ghost"
          >
            <LockOpen className="!h-4.5 !w-4.5" />
          </Button>
          <Button
            className="aspect-square !p-1 hover:!bg-gray-100 hover:!text-black"
            variant="ghost"
          >
            <CopyPlus className="!h-4.5 !w-4.5" />
          </Button>
          <Button
            className="aspect-square !p-1 hover:!bg-gray-100 hover:!text-black"
            variant="ghost"
          >
            <Trash className="!h-4.5 !w-4.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
