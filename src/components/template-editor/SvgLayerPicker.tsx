import SvgLayerTree from '@/components/template-editor/svg-editor/SvgLayerTree.tsx';
import BackButton from '@/components/ui/BackButton.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import useSvgLayerPicker from '@/hooks/template-editor/use-svg-layer-picker.ts';
import { cn } from '@/lib/utils.ts';
import React from 'react';

type SvgLayerPickerProps = React.ComponentPropsWithoutRef<'div'>;

export default function SvgLayerPicker({
  className,
  ...props
}: SvgLayerPickerProps) {
  const {
    state: { showSvgLayerPicker },
  } = useTemplateEditorContext();

  const { svgLayers, selected, loading, selectSvgLayer, validate } =
    useSvgLayerPicker();

  return showSvgLayerPicker ? (
    loading ? (
      <div>Chargement...</div>
    ) : (
      <div className={cn('relative flex flex-col', className)} {...props}>
        <BackButton
          className="mb-3"
          // onClick={() => setShowSvgLayerPicker(false)}
        />
        <SvgLayerTree
          className={cn({ 'pb-2': !!selected })}
          svgLayers={svgLayers}
          onLayerClick={selectSvgLayer}
          activeLayer={selected?.id}
        />
        {selected ? (
          <div className="sticky right-0 bottom-0 left-0 -m-2 bg-gray-100 p-2">
            <Button className="w-full" onClick={validate}>
              Utiliser ce calque
            </Button>
          </div>
        ) : null}
      </div>
    )
  ) : null;
}
