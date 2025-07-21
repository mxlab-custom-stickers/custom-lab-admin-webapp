import { Label } from '@/components/ui/label.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { isLayerColor } from '@clab/types';
import { useEffect, useState } from 'react';

/**
 * ColorLayerFocusControls component
 *
 * Displays controls for enabling/disabling the "focus mode" of a color layer in the configurator.
 * Focus mode dims other layers based on configuration.
 */
export default function ColorLayerFocusControls() {
  const [isFocusing, setIsFocusing] = useState<boolean>(false);

  const { currentLayer } = useConfiguratorContext();
  const { focusColorLayer } = useCanvas();

  useEffect(() => {
    return () => {
      setIsFocusing(false);
    };
  }, [currentLayer]);

  function handleFocusChange(isFocusing: boolean) {
    setIsFocusing(isFocusing);
    if (currentLayer && isLayerColor(currentLayer)) {
      focusColorLayer(currentLayer, isFocusing);
    }
  }

  if (!currentLayer || !isLayerColor(currentLayer)) return null;
  if (!currentLayer.config.focus.enable) return null;

  return (
    <div className="flex items-center gap-3 p-2">
      <Label className="text-base">
        <Switch checked={isFocusing} onCheckedChange={handleFocusChange} />
        {currentLayer.config.focus.message}
      </Label>
    </div>
  );
}
