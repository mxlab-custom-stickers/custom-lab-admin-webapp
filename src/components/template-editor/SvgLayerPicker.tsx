import SvgLayerTree from '@/components/template-editor/SvgLayerTree.tsx';
import { getSvgLayers } from '@/lib/svg.ts';
import { cn } from '@/lib/utils.ts';
import { SvgLayer } from '@/models/svg.ts';
import { SVG } from '@svgdotjs/svg.js';
import React, { useEffect, useState } from 'react';

type SvgLayerPickerProps = React.ComponentPropsWithoutRef<'div'> & {
  svgId: string;
  onSelectLayer?: (layer?: SvgLayer) => void;
};

export default function SvgLayerPicker({
  className,
  svgId,
  onSelectLayer,
  ...props
}: SvgLayerPickerProps) {
  const [svgLayers, setSvgLayers] = useState<SvgLayer[]>([]);
  const [selected, setSelected] = useState<SvgLayer>();

  useEffect(() => {
    const svg = SVG(`#${svgId}`)?.toRoot();
    if (!svg) return;

    setSvgLayers(getSvgLayers(svg));
  }, []);

  function selectLayer(layer: SvgLayer) {
    if (selected?.id === layer.id) {
      onSelectLayer?.(undefined);
      setSelected(undefined);
    } else {
      onSelectLayer?.(layer);
      setSelected(layer);
    }
  }

  return (
    <div className={cn(className)} {...props}>
      <SvgLayerTree
        svgLayers={svgLayers}
        onLayerClick={selectLayer}
        selected={selected?.id}
      />
    </div>
  );
}
