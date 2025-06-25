import FontSelector from '@/components/forms/FontSelector.tsx';
import OptionsCard from '@/components/Sidebar/shared/OptionsCard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { SearchInput } from '@/components/ui/SearchInput';
import { SelectAllCheckbox } from '@/components/ui/SelectAllCheckbox.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.tsx';
import { useFonts } from '@/hooks/use-fonts.ts';
import { type Font, isTemplateLayerText } from '@clab/types';
import { useEffect, useState } from 'react';

export default function FontsOptionsCard() {
  const { currentLayer, updateLayer } = useTemplateEditorContext();
  if (!currentLayer || !isTemplateLayerText(currentLayer)) return null;

  const { fonts, search, setSearch } = useFonts();

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedFonts, setSelectedFonts] = useState<Font[]>(() => initSelectedFonts());

  /**
   * Initializes the selected fonts based on the current layer's configuration.
   */
  function initSelectedFonts(): Font[] {
    return currentLayer?.type === 'text'
      ? currentLayer.config.availableFonts
          .map((fontName) => fonts.find((f) => f.name === fontName))
          .filter((font) => font !== undefined) || []
      : [];
  }

  useEffect(() => {
    setSelectedFonts(initSelectedFonts());
  }, [fonts]);

  function validate() {
    if (currentLayer?.type !== 'text') return;

    updateLayer({
      ...currentLayer,
      config: {
        ...currentLayer.config,
        availableFonts: selectedFonts.map((f) => f.name),
      },
    });
    setShowDialog(false);
  }

  return (
    <OptionsCard>
      <CardHeader>
        <CardTitle>Polices ({currentLayer.config.availableFonts.length})</CardTitle>
      </CardHeader>

      <CardContent>
        {currentLayer.config.availableFonts.length > 0 ? (
          <div className="text-muted-foreground line-clamp-3">
            {currentLayer.config.availableFonts.join(', ')}
          </div>
        ) : (
          <div className="text-muted-foreground">Aucune police ajoutée</div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              Configurer les polices
            </Button>
          </DialogTrigger>

          <DialogContent className="flex h-[95dvh] !max-w-4xl flex-col">
            <DialogHeader>
              <DialogTitle>Configurer les polices</DialogTitle>
              <DialogDescription>
                Choisissez les polices disponibles pour ce calque.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between gap-3">
              <SearchInput
                wrapperClassName="flex-1"
                placeholder="Rechercher une police..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="-mb-2 flex items-center justify-between gap-3">
              <div className="text-muted-foreground text-sm">
                ({selectedFonts.length}) sélectionnée(s)
              </div>
              <SelectAllCheckbox
                allItems={fonts}
                selectedItems={selectedFonts}
                onChange={setSelectedFonts}
              />
            </div>

            <FontSelector
              className="flex-1 rounded-md border"
              fonts={fonts}
              selectedFonts={selectedFonts}
              onChange={setSelectedFonts}
            />

            <DialogFooter className="gap-3">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Annuler
                </Button>
              </DialogClose>
              <Button onClick={validate} disabled={selectedFonts.length === 0}>
                Valider
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </OptionsCard>
  );
}
