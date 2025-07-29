import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import { renderSVGToCanvas, resizeCanvasToWrapper, setupZoomAndPan } from '@/lib/fabric.ts';
import { applyConfigurationToCanvas } from '@/utils/canvas';
import { Canvas } from 'fabric';
import { useEffect, useRef } from 'react';

type ConfiguratorCanvasProps = {
  offsetX?: number;
  offsetY?: number;
};

export default function ConfiguratorCanvas({ offsetX = 0, offsetY = 0 }: ConfiguratorCanvasProps) {
  const { configuration, setCanvas } = useConfigurator();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapperEl || !canvasEl) return;

    const canvas = new Canvas(canvasEl);

    const resize = () => resizeCanvasToWrapper(canvas, wrapperEl);
    resize();
    window.addEventListener('resize', resize);
    setupZoomAndPan(canvas);

    const initSvg = async () => {
      await renderSVGToCanvas(canvas, configuration.svgUrl, offsetX, offsetY);
    };

    initSvg().then(() => {
      console.debug('SVG rendered to canvas successfully');
      applyConfigurationToCanvas(canvas, configuration);
      console.debug('Configuration applied to canvas successfully');
      setCanvas(canvas);
    });

    return () => {
      void canvas.dispose();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-full w-full">
      <canvas id="configurator-canvas" ref={canvasRef} className="h-full w-full" />
      {/*{visible && pos && <TopControlsBox x={pos.x} y={pos.y} />}*/}
    </div>
  );
}
