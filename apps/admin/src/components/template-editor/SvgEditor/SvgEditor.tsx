import Svg from '@/components/template-editor/SvgEditor/Svg.tsx';
import SvgLayerTree from '@/components/template-editor/SvgEditor/SvgLayerTree.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { SvgEditorContext } from '@/contexts/svg-editor-context.ts';
import { cn } from '@/lib/utils';
import { SvgLayer } from '@/models/svg-editor.ts';
import React, { useEffect, useState } from 'react';

type SvgEditorProps = React.ComponentPropsWithoutRef<'div'> & {
  svgUrl: string;

  initialSelectedLayerIds?: string[];
  selectedLayers?: SvgLayer[];
  onSelectedLayersChange?: (layers: SvgLayer[]) => void;
};

export default function SvgEditor({
  className,
  svgUrl,
  initialSelectedLayerIds,
  selectedLayers: selectedLayersProp,
  onSelectedLayersChange,
  ...props
}: SvgEditorProps) {
  const [selectedLayers, _setSelectedLayers] = useState<SvgLayer[]>([]);

  const [isInjecting, setIsInjecting] = useState<boolean>(true);
  const [svgLayers, setSvgLayers] = useState<SvgLayer[]>([]);

  useEffect(() => {
    if (selectedLayersProp) {
      _setSelectedLayers(selectedLayersProp);
    }
  }, [selectedLayersProp]);

  function setSelectedLayers(layers: SvgLayer[]) {
    if (onSelectedLayersChange) {
      onSelectedLayersChange(layers);
    } else {
      _setSelectedLayers(layers);
    }
  }

  return (
    <SvgEditorContext.Provider
      value={{
        isInjecting,
        setIsInjecting,
        initialSelectedLayerIds,
        svgLayers,
        setSvgLayers,
        selectedLayers,
        setSelectedLayers,
      }}
    >
      <div
        className={cn(
          'grid h-[80svh] grid-cols-[auto_min-content] gap-y-2',
          className
        )}
        {...props}
      >
        <Svg wrapperClassName="self-center" svgUrl={svgUrl} />

        {isInjecting ? (
          <div>Chargement...</div>
        ) : (
          <ScrollArea className="overflow-y-auto rounded-xl bg-gray-100">
            <SvgLayerTree className="p-2" />
          </ScrollArea>
        )}
      </div>
    </SvgEditorContext.Provider>
  );
}
