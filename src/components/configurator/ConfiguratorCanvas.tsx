import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import {
  collectColorItems,
  getAllColorItemsFromTemplate,
  getAllImagesFromTemplate,
  resetInteractivity,
  updateImagesInTemplate,
} from '@/lib/configurator.ts';
import {
  assignFabricObjectsToColorItemsInLayer,
  clipImageLayerToColorLayer,
  drawImageOnCanvas,
  makeColorItemInteractive,
  makeImageInteractive,
  renderSVGToCanvas,
  resizeCanvasToWrapper,
  setupZoomAndPan,
} from '@/lib/fabric.ts';
import { cn } from '@/lib/utils.ts';
import { Template, TemplateLayerImage } from '@/models/template.ts';
import { Canvas } from 'fabric';
import { useEffect, useRef } from 'react';

type ConfiguratorCanvasProps = {
  wrapperClassName?: string;
};

export default function ConfiguratorCanvas({
  wrapperClassName,
}: ConfiguratorCanvasProps) {
  const {
    state: { template, canvas, currentLayerId },
    updateTemplate,
    setCanvas,
    currentLayer,
    setCurrentColorElementId,
  } = useConfiguratorContext();

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
          makeImageInteractive(image, (modifiedImage) => {
            const updatedTemplate = updateImagesInTemplate(
              templateRef.current,
              [modifiedImage]
            );
            updateTemplate(updatedTemplate);
          })
        );
      }

      canvas.requestRenderAll();
    });
  }, [template.layers, currentLayerId]);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapperEl || !canvasEl) return;

    const initCanvas = new Canvas(canvasEl);

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
        layer.type === 'color'
          ? assignFabricObjectsToColorItemsInLayer(layer, objects)
          : layer
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

      // Clip image layers with corresponding color layers if specified in their config
      await Promise.all(
        (
          updatedTemplate.layers.filter(
            (layer) =>
              layer.type === 'image' && layer.config.clipWithLayerId !== null
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
    <div ref={wrapperRef} className={cn('h-full w-full', wrapperClassName)}>
      <canvas
        id="configurator-canvas"
        ref={canvasRef}
        className="h-full w-full"
      />
    </div>
  );
}
