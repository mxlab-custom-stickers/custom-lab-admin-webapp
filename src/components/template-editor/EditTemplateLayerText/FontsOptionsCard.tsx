import FontSelector from '@/components/fonts/FontSelector.tsx';
import OptionsCard from '@/components/template-editor/OptionsCard.tsx';
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
import { SelectAllCheckbox } from '@/components/ui/filters/SelectAllCheckbox.tsx';
import { SearchInput } from '@/components/ui/SearchInput.tsx';
import { useFonts } from '@/hooks/use-fonts.ts';
import { Font } from '@/models/text.ts';
import { useState } from 'react';

export default function FontsOptionsCard() {
  const { fonts, search, setSearch } = useFonts();

  const [selectedFonts, setSelectedFonts] = useState<Font[]>([]);

  return (
    <OptionsCard>
      <CardHeader>
        <CardTitle>Polices</CardTitle>
      </CardHeader>

      <CardContent>
        <Dialog>
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
              <Button>Valider</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </OptionsCard>
  );
}
