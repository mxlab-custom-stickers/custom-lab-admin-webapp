import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { getAllColorItemsFromLayer } from '@/lib/configurator.ts';
import { hideOrShowObjectsById } from '@/lib/fabric.ts';
import { useEffect } from 'react';

export default function FocusSection() {
  const {
    state: {
      template: { layers },
      currentLayerId,
      canvas,
    },
    currentLayer,
    updateLayer,
  } = useConfiguratorContext();

  if (!currentLayer || currentLayer.type !== 'color') return null;

  const {
    config: { focus },
  } = currentLayer;

  useEffect(() => {
    return () => {
      focusLayer(false);
    };
  }, [currentLayerId]);

  function focusLayer(isFocusing: boolean) {
    if (!canvas) return;

    // Get all the fabric object ids from the layers to hide
    const ids = focus.layerIdsToHide
      .map((layerId) => layers.find((layer) => layer.id === layerId))
      .filter((layer) => layer !== undefined && layer.type === 'color')
      .map((layer) => getAllColorItemsFromLayer(layer))
      .flatMap((colorItems) => colorItems)
      .map((colorItem) => colorItem?.fabricObjects)
      .flatMap((objects) => objects)
      .filter((obj) => obj !== undefined)
      .map((obj) => obj.get('id'));

    hideOrShowObjectsById(canvas, ids, isFocusing);
  }

  function handleMessageChange(message: string) {
    if (!currentLayer || currentLayer.type !== 'color') return;

    updateLayer({
      ...currentLayer,
      config: { ...currentLayer.config, focus: { ...focus, message } },
    });
  }

  return focus.enable ? (
    <div className="flex items-center gap-2 p-2">
      <Switch onCheckedChange={focusLayer} />
      <InvisibleInput
        className="p-1"
        value={focus.message}
        onSubmit={handleMessageChange}
      />
    </div>
  ) : null;
}
