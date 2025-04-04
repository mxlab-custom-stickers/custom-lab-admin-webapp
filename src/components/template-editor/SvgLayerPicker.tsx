import SvgLayerTree from '@/components/template-editor/SvgLayerTree.tsx';
import { Button } from '@/components/ui/button.tsx';
import { focusElement, getSvgLayers, unfocusElement } from '@/lib/svg.ts';
import { cn } from '@/lib/utils.ts';
import { SvgLayer } from '@/models/svg.ts';
import { SVG } from '@svgdotjs/svg.js';
import React, { useEffect, useMemo, useState } from 'react';

type SvgLayerPickerProps = React.ComponentPropsWithoutRef<'div'> & {
  svgId: string;
  onLayerSelect: (layer: SvgLayer) => void;
};

export default function SvgLayerPicker({
  className,
  svgId,
  onLayerSelect,
  ...props
}: SvgLayerPickerProps) {
  const [selected, setSelected] = useState<SvgLayer>();

  const svgLayers = useMemo(() => {
    const svg = SVG(`#${svgId}`)?.toRoot();
    if (!svg) return [];
    return getSvgLayers(svg);
  }, [svgId]);

  useEffect(() => {
    return () => {
      // Clean up function to unfocus the element when the component unmounts
      unfocusElement(svgId);
    };
  }, []);

  /**
   * Select a layer and focus it.
   * @param layer
   */
  function selectLayer(layer: SvgLayer) {
    unfocusElement(svgId);

    if (selected?.id === layer.id) {
      setSelected(undefined);
    } else {
      setSelected(layer);
      focusElement(svgId, layer.id);
    }
  }

  return (
    <div className={cn('relative', className)} {...props}>
      <SvgLayerTree
        className={cn({ 'pb-3': !!selected })}
        svgLayers={svgLayers}
        onLayerClick={selectLayer}
        activeLayer={selected?.id}
      />

      {selected ? (
        <div className="sticky right-0 bottom-0 left-0 -m-2 bg-gray-100 p-2">
          <Button className="w-full" onClick={() => onLayerSelect(selected)}>
            Utiliser ce calque
          </Button>
        </div>
      ) : null}
    </div>
  );
}
