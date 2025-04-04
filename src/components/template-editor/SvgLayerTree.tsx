import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx';
import { cn } from '@/lib/utils.ts';
import { SvgLayer } from '@/models/svg.ts';
import { ChevronDown } from 'lucide-react';
import React from 'react';

type SvgLayerTreeProps = React.ComponentPropsWithoutRef<'div'> & {
  svgLayers: SvgLayer[];
  onLayerClick?: (layer: SvgLayer) => void;
  activeLayer?: string;
};

export default function SvgLayerTree({
  className,
  svgLayers,
  onLayerClick,
  activeLayer,
  ...props
}: SvgLayerTreeProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)} {...props}>
      {svgLayers.map((svgLayer) => (
        <SvgLayerItem
          key={svgLayer.id}
          svgLayer={svgLayer}
          onLayerClick={onLayerClick}
          activeLayer={activeLayer}
          depth={1}
        />
      ))}
    </div>
  );
}

function SvgLayerItem({
  svgLayer,
  onLayerClick,
  activeLayer,
  depth,
}: {
  svgLayer: SvgLayer;
  onLayerClick?: (layer: SvgLayer) => void;
  activeLayer?: string;
  depth: number;
}) {
  return svgLayer.children?.length ? (
    <>
      {/* Layer with children */}
      <Collapsible defaultOpen>
        <div
          className={cn(
            'mb-0.5 flex items-center justify-between rounded p-1 hover:bg-gray-200/80',
            {
              'bg-gray-200 font-semibold': activeLayer === svgLayer.id,
            }
          )}
        >
          <div
            className="line-clamp-1 flex-1 cursor-pointer"
            style={{ paddingLeft: `${depth * 0.75}rem` }}
            onClick={() => onLayerClick?.(svgLayer)}
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
              <SvgLayerItem
                key={child.id}
                svgLayer={child}
                onLayerClick={onLayerClick}
                activeLayer={activeLayer}
                depth={depth + 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  ) : (
    <>
      {/* Shape with no children */}
      <div
        className={cn(
          'flex cursor-pointer items-center rounded p-1 hover:bg-gray-200/80',
          {
            'bg-gray-200 font-semibold': activeLayer === svgLayer.id,
          }
        )}
        onClick={() => onLayerClick?.(svgLayer)}
      >
        <div
          className="line-clamp-1 flex-1"
          style={{ paddingLeft: `${depth * 0.75}rem` }}
        >
          {svgLayer.id}
        </div>

        {svgLayer.color ? (
          <div
            className="mr-[1px] h-3.5 w-3.5 rounded-full"
            style={{ backgroundColor: svgLayer.color }}
          ></div>
        ) : null}
      </div>
    </>
  );
}
