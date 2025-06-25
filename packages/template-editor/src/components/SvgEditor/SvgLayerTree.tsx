import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx';
import { useSvgEditorContext } from '@/contexts/svg-editor-context.ts';
import {
  hasSelectedParent,
  selectLayerAndCleanDescendants,
  smartSelectLayer,
  updateOpacityRecursively,
} from '@/lib/svg-editor.ts';
import type { SvgLayer } from '@/types/svg-editor.ts';
import { cn } from '@clab/utils';
import { ChevronDown } from 'lucide-react';
import React, { useCallback } from 'react';

export default function SvgLayerTree({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { svgLayers } = useSvgEditorContext();

  return (
    <div className={cn('flex w-full flex-col gap-0.5 text-sm', className)} {...props}>
      {svgLayers.map((svgLayer) => (
        <SvgLayerItem key={svgLayer.id} svgLayer={svgLayer} depth={1} />
      ))}
    </div>
  );
}

const SvgLayerItem = React.memo(function SvgLayerItem({
  svgLayer,
  depth,
}: {
  svgLayer: SvgLayer;
  depth: number;
}) {
  const { svgLayers, selectedLayers, setSelectedLayers } = useSvgEditorContext();

  /**
   * Handles the click event on an SVG layer.
   *
   * This function determines how to update the selected layers based on:
   * - Whether the clicked layer has a selected parent
   * - Whether the layer is already selected
   * - Whether it should clean descendants or perform a smart selection
   *
   * It then updates the `selectedLayers` state accordingly and refreshes the
   * opacity of the SVG elements based on the updated selection.
   *
   * @param {SvgLayer} layer - The clicked SVG layer.
   */
  const handleLayerClick = useCallback(
    (layer: SvgLayer) => {
      let updatedSelectedLayers;

      if (hasSelectedParent(layer, svgLayers, selectedLayers)) {
        updatedSelectedLayers = smartSelectLayer(layer.id, selectedLayers, svgLayers);
      } else if (selectedLayers.find((l) => l.id === layer.id)) {
        // If the layer is already selected, remove it from the selection
        updatedSelectedLayers = selectedLayers.filter((l) => l.id !== layer.id);
      } else {
        updatedSelectedLayers = selectLayerAndCleanDescendants(layer.id, selectedLayers, svgLayers);
      }

      setSelectedLayers(updatedSelectedLayers);
      updateOpacityRecursively(
        'svg-editor',
        updatedSelectedLayers.map((l) => l.id)
      );
    },
    [svgLayers, selectedLayers]
  );

  const isSelected = selectedLayers.find((l) => l.id === svgLayer.id);

  return svgLayer.children?.length ? (
    <Collapsible
      defaultOpen
      className={cn({
        'rounded bg-gray-200 font-semibold': isSelected,
      })}
    >
      <div
        className={cn('mb-0.5 flex items-center justify-between rounded p-1 hover:bg-gray-200/80')}
      >
        <div
          className="line-clamp-1 flex-1 cursor-pointer"
          style={{ paddingLeft: `${depth * 0.75}rem` }}
          onClick={() => handleLayerClick(svgLayer)}
        >
          {svgLayer.id}
        </div>

        <CollapsibleTrigger className="group">
          <ChevronDown
            size={16}
            className="text-ring duration-200 group-data-[state=open]:rotate-180"
          />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="flex flex-col gap-0.5">
          {svgLayer.children?.map((child) => (
            <SvgLayerItem key={child.id} svgLayer={child} depth={depth + 1} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <div
      className={cn('flex cursor-pointer items-center rounded p-1 hover:bg-gray-200/80', {
        'bg-gray-200 font-semibold': isSelected,
      })}
      onClick={() => handleLayerClick(svgLayer)}
    >
      <div className="line-clamp-1 flex-1" style={{ paddingLeft: `${depth * 0.75}rem` }}>
        {svgLayer.id}
      </div>

      {svgLayer.color ? (
        <div
          className="mr-[1px] h-3.5 w-3.5 rounded-full"
          style={{ backgroundColor: svgLayer.color }}
        ></div>
      ) : null}
    </div>
  );
});
