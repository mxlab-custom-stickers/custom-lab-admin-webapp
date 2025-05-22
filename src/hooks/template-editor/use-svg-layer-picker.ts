import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { focusElement, getSvgLayers, unfocusElement } from '@/lib/svg.ts';
import { svgLayerToColorElement } from '@/lib/template-editor.ts';
import { SvgLayer } from '@/models/svg-editor.ts';
import { SVG } from '@svgdotjs/svg.js';
import { useEffect, useMemo, useState } from 'react';

export default function useSvgLayerPicker() {
  const { setShowSvgLayerPicker } = useTemplateEditorContext();

  const {
    state: { template, svgInjecting, currentLayer },
    updateCurrentLayer,
    setCurrentColorElement,
  } = useConfiguratorContext();

  const { id: svgId } = template;

  const [selected, setSelected] = useState<SvgLayer>();

  /**
   * Get the svg layers from the svg element.
   */
  const svgLayers = useMemo(() => {
    if (svgInjecting) return [];
    const svg = SVG(`#${svgId}`)?.toRoot();
    if (!svg) return [];
    return getSvgLayers(svg);
  }, [svgId, svgInjecting]);

  useEffect(() => {
    return () => {
      // Clean up function to unfocus the element when the component unmounts
      unfocusElement(svgId);
    };
  }, []);

  /**
   * Select a svg layer and focus it.
   * @param svgLayer
   */
  function selectSvgLayer(svgLayer: SvgLayer) {
    unfocusElement(svgId);

    if (selected?.id === svgLayer.id) {
      setSelected(undefined);
    } else {
      setSelected(svgLayer);
      focusElement(svgId, svgLayer.id);
    }
  }

  function validate() {
    if (!selected || !currentLayer) return;

    const updatedLayer = {
      ...currentLayer,
      id: selected.id,
      name: selected.id,
      colorElements: svgLayerToColorElement(selected),
    };

    unfocusElement(svgId);
    updateCurrentLayer(updatedLayer);
    setCurrentColorElement(undefined);
    setShowSvgLayerPicker(false);
  }

  return {
    svgLayers,
    selected,
    loading: svgInjecting,
    selectSvgLayer,
    validate,
  };
}
