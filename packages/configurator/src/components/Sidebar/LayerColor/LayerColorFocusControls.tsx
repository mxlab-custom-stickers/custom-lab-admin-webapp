import { Label } from '@/components/ui/label.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { isTemplateLayerColor } from '@clab/types';
import { useEffect, useState } from 'react';

/**
 * ColorLayerFocusControls component
 *
 * Displays controls for enabling/disabling the "focus mode" of a color layer
 * in the configurator. Focus mode dims other layers based on configuration.
 *
 * - A switch toggles focus mode (handled by `focusColorLayer`)
 * - A text input allows editing the focus message (via `InvisibleInput`)
 * - On unmount or layer change, focus mode is automatically disabled
 */
export default function ColorLayerFocusControls() {
  const [isFocusing, setIsFocusing] = useState<boolean>(false);

  const {
    state: { currentLayerId },
    currentLayer,
  } = useConfiguratorContext();

  if (!currentLayer || !isTemplateLayerColor(currentLayer)) return null;
  if (!currentLayer.config.focus.enable) return null;

  const { focusColorLayer } = useCanvas();

  /**
   * Cleanup: disables focus mode and resets UI state when current layer changes
   */
  useEffect(() => {
    return () => {
      focusColorLayer(currentLayer, false);
      setIsFocusing(false);
    };
  }, [currentLayerId]);

  function handleFocusChange(isFocusing: boolean) {
    setIsFocusing(isFocusing);

    if (!currentLayer || !isTemplateLayerColor(currentLayer)) return;
    focusColorLayer(currentLayer, isFocusing);
  }

  return (
    <div className="flex items-center gap-3 p-2">
      <Label className="text-base">
        <Switch checked={isFocusing} onCheckedChange={handleFocusChange} />
        {currentLayer.config.focus.message}
      </Label>
    </div>
  );
}
