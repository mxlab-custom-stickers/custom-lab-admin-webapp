import OptionsCard from '@/components/template-editor/EditTemplateLayerColor/OptionsCard.tsx';
import SvgEditor from '@/components/template-editor/svg-editor/SvgEditor.tsx';
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
import { svgLayerToColorElement } from '@/lib/template-editor.ts';
import { cn } from '@/lib/utils.ts';
import { SvgLayer } from '@/models/svg-editor.ts';
import React, { useState } from 'react';

export default function ColorElementsOptionsCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const {
    state: { template, currentLayer: currentTemplateLayer },
    updateCurrentLayer,
  } = useTemplateEditorContext();

  const [initialSelectedLayerIds, setInitialSelectedLayerIds] = useState<
    string[]
  >(getInitialSelectedLayerIds);
  const [selectedSvgLayers, setSelectedSvgLayers] = useState<SvgLayer[]>([]);

  /**
   * SVG layers and template color elements have matching ids.
   */
  function getInitialSelectedLayerIds() {
    return currentTemplateLayer?.colorElements.map((ce) => ce.id) || [];
  }

  function validate() {
    if (!currentTemplateLayer) return;

    updateCurrentLayer({
      ...currentTemplateLayer,
      colorElements: selectedSvgLayers.map(svgLayerToColorElement),
    });
    setShowDialog(false);
    setInitialSelectedLayerIds(selectedSvgLayers.map((layer) => layer.id));
  }

  return (
    <OptionsCard className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>SVG</CardTitle>
      </CardHeader>

      <CardContent>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              {currentTemplateLayer?.colorElements.length
                ? 'Changer les formes'
                : 'Sélectionner les formes'}
            </Button>
          </DialogTrigger>

          <DialogContent
            className="!max-w-6xl gap-0 p-3"
            withCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className="sr-only">Svg Editor</DialogTitle>
              <DialogDescription className="sr-only">
                Modifier le svg et sélectionner des formes.
              </DialogDescription>
            </DialogHeader>

            <SvgEditor
              svgUrl={template.svgUrl}
              initialSelectedLayerIds={initialSelectedLayerIds}
              selectedLayers={selectedSvgLayers}
              onSelectedLayersChange={setSelectedSvgLayers}
            />

            <DialogFooter className="gap-3 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Annuler
                </Button>
              </DialogClose>
              <Button
                onClick={validate}
                disabled={selectedSvgLayers.length === 0}
              >
                Sélectionner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </OptionsCard>
  );
}
