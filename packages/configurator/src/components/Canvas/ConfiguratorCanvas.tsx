import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import { renderSVGToCanvas, resizeCanvasToWrapper, setupZoomAndPan } from '@/lib/fabric.ts';
import {
  applyConfigurationToCanvas,
  deactivateFabricObjectsInConfigurationByLayerIds,
} from '@/utils/canvas';
import { removeCanvasElementById } from '@/utils/configuration-helpers.ts';
import { Canvas } from 'fabric';
import { useCallback, useEffect, useRef } from 'react';

type ConfiguratorCanvasProps = {
  offsetX?: number;
  offsetY?: number;
};

export default function ConfiguratorCanvas({ offsetX = 0, offsetY = 0 }: ConfiguratorCanvasProps) {
  const { configuration, currentLayer, setCanvas, setConfiguration, undo, canUndo, redo, canRedo } =
    useConfigurator();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas>(null);

  // Delete key handler — uses latest performConfigurationUpdate and canvas
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isRedo =
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'z') ||
        (event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'y'); // Ctrl+Y for Windows redo
      const isUndo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z';

      if (isRedo) {
        console.debug('Redo key pressed');
        event.preventDefault(); // Prevent default browser redo behavior
        if (!canRedo) return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        redo(applyConfigurationToCanvas);
        return;
      }

      if (isUndo) {
        console.debug('Undo key pressed');
        event.preventDefault(); // Prevent default browser undo behavior
        if (!canUndo) return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        undo(applyConfigurationToCanvas);
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        console.debug('Delete or Backspace keys pressed');
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        if (!currentLayer) {
          console.error('Cannot delete object: no current layer selected');
          return;
        }

        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          setConfiguration(
            removeCanvasElementById(configuration, currentLayer.id, activeObject.get('id'))
          );
          canvas.remove(activeObject);
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          console.debug('Deleted object:', activeObject.get('id'));
        }
      }
    },
    [configuration, currentLayer, fabricCanvasRef] // react will recreate the callback if this changes
  );

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapperEl || !canvasEl) return;

    const canvas = new Canvas(canvasEl);
    fabricCanvasRef.current = canvas;
    canvas.selection = false;

    const resize = () => resizeCanvasToWrapper(canvas, wrapperEl);
    resize();
    window.addEventListener('resize', resize);
    setupZoomAndPan(canvas);

    const init = async () => {
      await renderSVGToCanvas(canvas, configuration.svgUrl, offsetX, offsetY);
      console.debug('SVG rendered to canvas successfully');
      await applyConfigurationToCanvas(canvas, configuration);
      const layerIdsToDeactivate = configuration.layers
        .filter((l) => l.id !== currentLayer?.id)
        .map((l) => l.id);
      deactivateFabricObjectsInConfigurationByLayerIds(canvas, configuration, layerIdsToDeactivate);
      console.debug('Configuration applied to canvas successfully');
      setCanvas(canvas);
    };

    init().catch((err) => {
      console.error('Error initializing canvas:', err);
      // TODO: Handle error appropriately
    });

    return () => {
      void canvas.dispose();
      window.removeEventListener('resize', resize);
      fabricCanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full">
      <canvas id="configurator-canvas" ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
