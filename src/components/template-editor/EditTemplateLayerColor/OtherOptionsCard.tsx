import OptionsCard from '@/components/template-editor/EditTemplateLayerColor/OptionsCard.tsx';
import TemplateLayerSelector from '@/components/template-editor/TemplateLayerSelector.tsx';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import React from 'react';

export default function OtherOptionsCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { currentLayer, updateLayer } = useTemplateEditorContext();

  if (currentLayer?.type !== 'color') return null;

  const { config } = currentLayer;

  function handleEnableColorPaletteChange(checked: boolean) {
    if (!currentLayer) return;
    updateLayer({
      ...currentLayer,
      config: { ...config, enableColorPalette: checked },
    });
  }

  function handleEnableFocusChange(checked: boolean) {
    if (!currentLayer) return;
    updateLayer({
      ...currentLayer,
      config: { ...config, focus: { ...config.focus, enable: checked } },
    });
  }

  return (
    <OptionsCard className={className} {...props}>
      <CardHeader>
        <CardTitle>Autres options</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3 *:font-normal">
          <Label>
            <Switch
              checked={config.enableColorPalette}
              onCheckedChange={handleEnableColorPaletteChange}
            />
            Palette de couleurs
          </Label>

          <div>
            <Label>
              <Switch
                checked={config.focus.enable}
                onCheckedChange={handleEnableFocusChange}
              />
              Autoriser le focus
            </Label>

            {config.focus.enable ? (
              <div className="mt-3 flex flex-col gap-1.5">
                <div className="text-muted-foreground text-xs">
                  Sélectionne les calques à cacher
                </div>
                <TemplateLayerSelector />
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </OptionsCard>
  );
}
