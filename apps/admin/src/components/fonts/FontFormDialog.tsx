import { Button } from '@/components/ui/button.tsx';
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
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import Submit from '@/components/ui/Submit.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { useFontForm } from '@/hooks/forms/use-font-form.ts';
import { fontStyles, FontStyleType } from '@/models/text.ts';
import { Plus } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function FontFormDialog({ className }: { className?: string }) {
  const {
    formState,
    updateName,
    updateDigitsOnly,
    updateStyle,
    submit,
    loading,
    isFormValid,
    resetForm,
  } = useFontForm();

  function handleStyleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    fontStyle: FontStyleType
  ) {
    const file = e.target.files?.[0];
    if (file) updateStyle(file, fontStyle);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submit();
    toast.success('Police ajoutée', { duration: 5000 });
    resetForm();
  }

  return (
    <Dialog>
      <DialogTrigger className={className} asChild>
        <Button>
          <Plus />
          Nouvelle police
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-2xl gap-6">
        <DialogHeader>
          <DialogTitle>Nouvelle police</DialogTitle>
          <DialogDescription>
            Crée une nouvelle police personnalisée pour les textes
          </DialogDescription>
        </DialogHeader>

        <form
          id="font-form"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <Label className="flex flex-col items-start">
            Nom de la police
            <Input
              placeholder="ex: Roboto"
              value={formState.name}
              onChange={(e) => updateName(e.target.value)}
              required
            />
          </Label>

          <div className="grid grid-cols-[auto_min-content] items-center rounded-md border p-3 shadow-xs">
            <Label
              htmlFor="digitsOnly"
              className="flex flex-col items-start gap-0.5"
            >
              Police numérique uniquement
              <span className="text-muted-foreground text-xs">
                Indique si la police sera utilisée uniquement pour afficher des
                numéros
              </span>
            </Label>

            <Switch
              id="digitsOnly"
              checked={formState.digitsOnly}
              onCheckedChange={(checked) => updateDigitsOnly(checked)}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-[80px_200px_auto] items-center gap-x-8 gap-y-4">
            <Label className="col-span-3 flex flex-col items-start gap-1">
              Importe tes fichiers de police séparemment selon leur type
              <span className="text-muted-foreground text-xs">
                Au minimum un fichier est requis
              </span>
            </Label>

            {Object.entries(fontStyles).map(([style, label]) => (
              <React.Fragment key={style}>
                <Label htmlFor={style}>{label}</Label>

                <Input
                  id={style}
                  type="file"
                  name={style}
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={(e) => handleStyleChange(e, style as FontStyleType)}
                />

                {/* Font preview */}
                {formState.styles?.[style as FontStyleType] !== null ? (
                  <div
                    className="line-clamp-1 h-12 truncate p-1 font-[font-form-preview] text-2xl"
                    style={{
                      fontWeight:
                        formState.styles[style as FontStyleType]!.weight,
                      fontStyle:
                        formState.styles[style as FontStyleType]!.style,
                    }}
                  >
                    {formState.digitsOnly
                      ? '0123456789'
                      : 'Custom Lab 2 by MXlab'}
                  </div>
                ) : (
                  <div className="h-12" />
                )}
              </React.Fragment>
            ))}
          </div>
        </form>

        <DialogFooter className="gap-3">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </DialogClose>
          <Submit loading={loading} disabled={!isFormValid} form="font-form">
            Créer la police
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
