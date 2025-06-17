import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { useConfiguratorCanvas } from '@/hooks/use-configurator-canvas.ts';
import { isTemplateLayerColor } from '@/models/template.ts';
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
    updateLayer,
  } = useConfiguratorContext();

  if (!currentLayer || !isTemplateLayerColor(currentLayer)) return null;
  const { config } = currentLayer;
  if (!config.focus.enable) return null;

  const { focusColorLayer } = useConfiguratorCanvas();

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

  function handleMessageChange(message: string) {
    if (!currentLayer || !isTemplateLayerColor(currentLayer)) return;

    updateLayer({
      ...currentLayer,
      config: {
        ...currentLayer.config,
        focus: { ...config.focus, message },
      },
    });
  }

  return (
    <div className="flex items-center gap-3 p-2">
      <Switch checked={isFocusing} onCheckedChange={handleFocusChange} />
      <InvisibleInput
        className="p-1"
        defaultValue={config.focus.message}
        onValueSubmit={handleMessageChange}
      />
    </div>
  );
}
