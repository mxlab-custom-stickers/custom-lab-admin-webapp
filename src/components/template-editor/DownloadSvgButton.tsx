import { Button } from '@/components/ui/button.tsx';
import { Canvas, FabricImage } from 'fabric';
import { Download } from 'lucide-react';

export default function DownloadSvgButton() {
  async function embedImagesAsDataURL(canvas: Canvas): Promise<void> {
    const imageObjects = canvas.getObjects('image') as FabricImage[];

    await Promise.all(
      imageObjects.map(
        (img) =>
          new Promise<void>((resolve, reject) => {
            const src = img.getSrc();
            if (src && !src.startsWith('data:')) {
              const image = new Image();
              image.crossOrigin = 'Anonymous';
              image.onload = () => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = image.width;
                tempCanvas.height = image.height;
                const ctx = tempCanvas.getContext('2d');
                if (!ctx) return reject('No canvas context');
                ctx.drawImage(image, 0, 0);
                const dataURL = tempCanvas.toDataURL('image/png');
                img.setSrc(dataURL).then(() => resolve());
              };
              image.onerror = reject;
              image.src = src;
            } else {
              resolve();
            }
          })
      )
    );

    canvas.requestRenderAll();
  }

  async function downloadSVGFromGlobalCanvas() {
    const canvas = (window as any).__fabricCanvas;
    if (!canvas) {
      console.error('Fabric canvas instance not found on window.');
      return;
    }

    await embedImagesAsDataURL(canvas); // Make sure all images are embedded

    const svg = canvas.toSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="ghost" size="icon" onClick={downloadSVGFromGlobalCanvas}>
      <Download />
    </Button>
  );
}
