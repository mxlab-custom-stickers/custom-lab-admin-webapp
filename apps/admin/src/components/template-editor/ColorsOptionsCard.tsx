import ColorSelector from '@/components/colors/ColorSelector.tsx';
import OptionsCard from '@/components/template-editor/OptionsCard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { Color } from '@/models/color.ts';
import { JSX, useEffect, useState } from 'react';

/**
 * ColorsOptionsCard component allows editing the available colors
 * for the current template layer (either a color or text layer).
 *
 * It displays a summary of the currently selected colors and
 * provides a dialog to configure colors by selecting from palettes
 * or the full color list.
 *
 * Behavior:
 * - Shows a button to open a color configuration dialog.
 * - Synchronizes local state with the current layer's available colors.
 * - Allows adding/removing colors inside the dialog via the ColorSelector.
 * - Validates and updates the current layer on confirmation.
 *
 * The component depends on the template editor context to
 * get the current layer and to update it.
 *
 * @returns {JSX.Element | null} The color configuration UI or null
 *   if no editable color or text layer is selected.
 */
export default function ColorsOptionsCard(): JSX.Element | null {
  const {
    state: {
      config: { colorPalettes, colors },
    },
    currentLayer,
    updateLayer,
  } = useTemplateEditorContext();

  if (!currentLayer || (currentLayer.type !== 'color' && currentLayer.type !== 'text')) return null;

  const { availableColors } = currentLayer.config;
  const [value, setValue] = useState<Color[]>(availableColors);

  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    setValue(availableColors);
  }, [availableColors]);

  function validate() {
    if (!currentLayer) return;

    if (currentLayer.type === 'color') {
      updateLayer({
        ...currentLayer,
        config: {
          ...currentLayer.config,
          availableColors: value,
        },
      });
    } else if (currentLayer.type === 'text') {
      updateLayer({
        ...currentLayer,
        config: {
          ...currentLayer.config,
          availableColors: value,
        },
      });
    }

    setShowDialog(false);
  }

  return (
    <OptionsCard>
      <CardHeader>
        <CardTitle>Couleurs ({availableColors.length})</CardTitle>
      </CardHeader>

      <CardContent>
        {availableColors.length ? (
          <div className="mb-1 grid grid-cols-8 gap-0.5">
            {availableColors.map((color) => (
              <div
                key={color.id}
                className="aspect-square w-full rounded"
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">Aucune couleur ajoutée</div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              Configurer les couleurs
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="sr-only">Configurer les couleurs</DialogHeader>
            <DialogDescription className="sr-only">
              Sélectionnez vos couleurs parmis les palettes ou la liste de couleurs disponible.
            </DialogDescription>

            <ColorSelector
              className="h-[75svh]"
              value={value}
              onValueChange={setValue}
              config={{ palettes: colorPalettes, colors }}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Annuler
                </Button>
              </DialogClose>
              <Button onClick={validate}>Valider</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </OptionsCard>
  );
}
