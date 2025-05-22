// Memoized the SVG so it doesn't re-render on every state change
import { useSvgEditorContext } from '@/contexts/svg-editor-context.ts';
import {
  flattenSvgLayers,
  getSvgLayers,
  updateOpacityRecursively,
} from '@/lib/svg-editor.ts';
import { cn } from '@/lib/utils.ts';
import { SVG } from '@svgdotjs/svg.js';
import React, { useMemo } from 'react';
import { ReactSVG, Props as ReactSVGProps } from 'react-svg';

const ReactSVGMemo = React.memo(ReactSVG);

type SvgProps = {
  wrapperClassName?: string;
  svgUrl: string;
};

export default function Svg({ svgUrl, wrapperClassName }: SvgProps) {
  const {
    setIsInjecting,
    initialSelectedLayerIds,
    setSvgLayers,
    setSelectedLayers,
  } = useSvgEditorContext();

  const memoValue: Omit<ReactSVGProps, 'ref'> = useMemo(
    () => ({
      src: new URL(svgUrl, import.meta.url).href,
      beforeInjection: (svg) => {
        setIsInjecting(true);
        svg.setAttribute('id', 'svg-editor');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
      },
      afterInjection: () => {
        const svg = SVG('#svg-editor')?.toRoot();
        if (svg) {
          const layers = getSvgLayers(svg);
          const flatLayers = flattenSvgLayers(layers);

          setSvgLayers(layers);

          // Initialize selected layers from the initialSelectedLayerIds prop
          if (initialSelectedLayerIds) {
            setSelectedLayers(
              flatLayers.filter((layer) =>
                initialSelectedLayerIds.includes(layer.id)
              )
            );
            updateOpacityRecursively('svg-editor', initialSelectedLayerIds);
          }
        }
        setIsInjecting(false);
      },
    }),
    []
  );

  return (
    <div className={cn(wrapperClassName)}>
      <ReactSVGMemo {...memoValue} />
    </div>
  );
}
