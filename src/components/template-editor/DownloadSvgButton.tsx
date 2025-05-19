import { Button } from '@/components/ui/button.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-context.ts';
import { Download } from 'lucide-react';

export default function DownloadSvgButton() {
  const { template } = useConfiguratorContext();

  function downloadSvg() {
    const svg = document.querySelector(`#${template.id}`) as SVGSVGElement;
    if (!svg) return;

    // Clone and add namespace if missing
    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Serialize to string
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'external-image.svg';
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="ghost" size="icon" onClick={downloadSvg}>
      <Download />
    </Button>
  );
}
