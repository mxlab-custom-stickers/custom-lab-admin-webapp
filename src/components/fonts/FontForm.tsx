import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { useAppContext } from '@/contexts/app-context.ts';
import { addFont } from '@/lib/firebase/firestore.ts';
import { uploadFile } from '@/lib/firebase/storage.ts';
import { generateId } from '@/lib/nanoid.ts';
import { cn } from '@/lib/utils.ts';
import {
  Font,
  FontStyle,
  FontStyleType,
  fontStyleStyles,
  fontStyles,
  fontWeights,
} from '@/models/text.ts';
import React, { useState } from 'react';

type FontFormType = {
  name: string;
  digitsOnly: boolean;
  styles: Record<FontStyleType, (FontStyle & { file: File }) | null>;
};

type FontFormProps = React.ComponentPropsWithoutRef<'form'>;

export default function FontForm({ className, ...props }: FontFormProps) {
  const { currentApp } = useAppContext();

  const [formState, setFormState] = useState<FontFormType>({
    name: '',
    digitsOnly: false,
    styles: {
      light: null,
      'light-italic': null,
      regular: null,
      italic: null,
      bold: null,
      'bold-italic': null,
    },
  });

  async function handleStyleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    fontStyle: FontStyleType
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fontUrl = URL.createObjectURL(file);
    const weight = fontWeights[fontStyle];
    const style = fontStyleStyles[fontStyle];

    try {
      const font = new FontFace('font-form-preview', `url(${fontUrl})`, {
        weight,
        style,
      });
      await font.load();
      document.fonts.add(font);

      const newStyle = {
        url: fontUrl,
        weight,
        style,
        file,
      };

      setFormState({
        ...formState,
        styles: {
          ...formState.styles,
          [fontStyle]: newStyle,
        },
      });
    } catch (err) {
      console.error('Failed to load font:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentApp) return;
    if (!formState.name) return;

    const fontName = formState.name.trim();
    const fontFolderPath = `/${currentApp.id}/Fonts/${fontName}`;

    const newFontStyles: Record<FontStyleType, FontStyle | null> = {
      light: null,
      'light-italic': null,
      regular: null,
      italic: null,
      bold: null,
      'bold-italic': null,
    };

    // Upload each font style file
    await Promise.all(
      Object.keys(fontStyles).map(async (styleType) => {
        const fontStyle = formState.styles?.[styleType as FontStyleType];
        if (fontStyle === null) return;

        const fileExtension = fontStyle.file.name
          .split('.')
          .pop()
          ?.toLowerCase();
        const fileName = `${formState.name} - ${fontStyles[styleType as FontStyleType]}.${fileExtension}`;
        const filePath = `${fontFolderPath}/${fileName}`;

        console.log(`Uploading ${fileName} to ${filePath}`);
        const downloadUrl = await uploadFile(fontStyle.file, filePath);

        newFontStyles[styleType as FontStyleType] = {
          url: downloadUrl,
          weight: fontStyle.weight,
          style: fontStyle.style,
        };
      })
    );

    const newFont: Font = {
      appId: currentApp.id,
      id: generateId(),
      name: fontName,
      digitsOnly: formState.digitsOnly,
      styles: newFontStyles,
      status: 'active',
    };

    console.log(newFont);

    await addFont(newFont);
  }

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <Label className="flex flex-col items-start">
        Nom de la police
        <Input
          placeholder="ex: Roboto"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
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
          onCheckedChange={(checked) =>
            setFormState({ ...formState, digitsOnly: checked })
          }
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
            {formState.styles?.[style as FontStyleType] !== null ? (
              <div
                className="line-clamp-1 h-12 truncate p-1 font-[font-form-preview] text-2xl"
                style={{
                  fontWeight: formState.styles[style as FontStyleType]!.weight,
                  fontStyle: formState.styles[style as FontStyleType]!.style,
                }}
              >
                {formState.digitsOnly ? '0123456789' : 'Custom Lab 2 by MXlab'}
              </div>
            ) : (
              <div className="h-12" />
            )}
          </React.Fragment>
        ))}
      </div>
    </form>
  );
}
