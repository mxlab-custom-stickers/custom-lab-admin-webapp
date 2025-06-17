import { useAppContext } from '@/contexts/app-context.ts';
import { addFont } from '@/lib/firebase/firestore.ts';
import { uploadFile } from '@/lib/firebase/storage.ts';
import { generateId } from '@/lib/nanoid.ts';
import {
  Font,
  FontStyle,
  FontStyleType,
  fontStyleStyles,
  fontStyles,
  fontWeights,
} from '@/models/text.ts';
import { useState } from 'react';

export type FontFormType = {
  name: string;
  digitsOnly: boolean;
  styles: Record<FontStyleType, (FontStyle & { file: File }) | null>;
};

const emptyFormState: FontFormType = {
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
};

/**
 * Custom React hook to manage font form state and submission logic.
 *
 * @param {FontFormType} [initial] - Optional initial form state.
 * @returns {{
 *   formState: FontFormType;
 *   updateName: (name: string) => void;
 *   updateDigitsOnly: (value: boolean) => void;
 *   updateStyle: (file: File, style: FontStyleType) => Promise<void>;
 *   submit: () => Promise<void>;
 *   loading: boolean;
 *   isFormValid: boolean;
 *   resetForm: () => void;
 * }}
 */
export function useFontForm(initial?: FontFormType): {
  formState: FontFormType;
  updateName: (name: string) => void;
  updateDigitsOnly: (value: boolean) => void;
  updateStyle: (file: File, style: FontStyleType) => Promise<void>;
  submit: () => Promise<void>;
  loading: boolean;
  isFormValid: boolean;
  resetForm: () => void;
} {
  const { currentApp } = useAppContext();

  const [formState, setFormState] = useState<FontFormType>(initial || emptyFormState);

  const [loading, setLoading] = useState(false);

  const isFormValid =
    formState.name.trim().length > 0 &&
    Object.values(formState.styles).some((style) => style !== null);

  function updateName(name: string) {
    setFormState(function (prev) {
      return { ...prev, name };
    });
  }

  function updateDigitsOnly(value: boolean) {
    setFormState(function (prev) {
      return { ...prev, digitsOnly: value };
    });
  }

  async function updateStyle(file: File, style: FontStyleType) {
    const fontUrl = URL.createObjectURL(file);
    const weight = fontWeights[style];
    const styleValue = fontStyleStyles[style];

    try {
      const font = new FontFace('font-form-preview', `url(${fontUrl})`, {
        weight,
        style: styleValue,
      });
      await font.load();
      document.fonts.add(font);

      const newStyle = {
        url: fontUrl,
        weight,
        style: styleValue,
        file,
      };

      setFormState(function (prev) {
        return {
          ...prev,
          styles: { ...prev.styles, [style]: newStyle },
        };
      });
    } catch (err) {
      console.error('Failed to load font:', err);
    }
  }

  async function submit() {
    if (!currentApp || !isFormValid || loading) return;

    setLoading(true);

    try {
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

      await Promise.all(
        Object.entries(formState.styles).map(async function ([style, data]) {
          if (!data) return;
          const ext = data.file.name.split('.').pop()?.toLowerCase();
          const filename = `${fontName} - ${fontStyles[style as FontStyleType]}.${ext}`;
          const path = `${fontFolderPath}/${filename}`;
          const url = await uploadFile(data.file, path);

          newFontStyles[style as FontStyleType] = {
            url,
            weight: data.weight,
            style: data.style,
          };
        })
      );

      const newFont: Font = {
        id: generateId(),
        appId: currentApp.id,
        name: fontName,
        digitsOnly: formState.digitsOnly,
        styles: newFontStyles,
        status: 'active',
      };

      await addFont(newFont);
      console.debug('Font added:', newFont);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormState(emptyFormState);
  }

  return {
    formState,
    updateName,
    updateDigitsOnly,
    updateStyle,
    submit,
    loading,
    isFormValid,
    resetForm,
  };
}
