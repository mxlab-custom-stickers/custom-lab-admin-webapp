import TemplateLayerColorColorsConfigurator, {
  ColorsConfiguratorState,
} from '@/components/template-editor/EditTemplateLayerColor/TemplateLayerColorColorsConfigurator.tsx';
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
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils.ts';
import React, { useEffect, useState } from 'react';

export default function ColorsOptionsCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const {
    state: {
      config: { colors, colorPalettes },
    },
    currentLayer,
    updateLayer,
  } = useTemplateEditorContext();

  if (!currentLayer || currentLayer.type !== 'color') return null;

  const [state, setState] = useState<ColorsConfiguratorState>(
    currentLayer?.config || {
      availableColors: [],
      columns: 5,
      space: 2,
    }
  );

  useEffect(() => {
    setState(
      currentLayer?.config || {
        availableColors: [],
        columns: 5,
        space: 2,
      }
    );
  }, [currentLayer]);

  function validate() {
    if (!currentLayer || currentLayer.type !== 'color') return;
    updateLayer({
      ...currentLayer,
      config: {
        ...currentLayer.config,
        ...state,
      },
    });
    setShowDialog(false);
  }

  return (
    <OptionsCard className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Couleurs ({currentLayer?.config.availableColors.length})</CardTitle>
      </CardHeader>

      <CardContent>
        {currentLayer?.config.availableColors.length ? (
          <div className="mb-1 grid grid-cols-8 gap-0.5">
            {currentLayer.config.availableColors.map((color) => (
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

          <DialogContent className="!max-w-4xl gap-0" withCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="sr-only">Configurer les couleurs</DialogTitle>
              <DialogDescription className="sr-only">
                Choisissez les couleurs disponibles pour le calque ainsi que leur affichage.
              </DialogDescription>
            </DialogHeader>

            <TemplateLayerColorColorsConfigurator
              allColors={colors}
              allColorPalettes={colorPalettes}
              state={state}
              onStateChange={setState}
            />

            <DialogFooter className="gap-3 pt-5">
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
