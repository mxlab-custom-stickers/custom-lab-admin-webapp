import { Status } from '@/models/common.ts';

export interface Text {
  id: string;
  value: string; // The text content
  font: Font;
  fontSize: number; // Font size in pixels
}

/**
 * Fonts
 */
export interface Font {
  appId: string; // ID of the app this font belongs to

  id: string;
  name: string;

  styles: Record<FontStyleType, FontStyle | null>;

  digitsOnly: boolean;

  status: Status;
}

// Metadata for the font styles
export interface FontStyle {
  url: string;
  weight: string;
  style: 'normal' | 'italic';
}

export type FontStyleType =
  | 'light'
  | 'light-italic'
  | 'regular'
  | 'italic'
  | 'bold'
  | 'bold-italic';

export const fontStyles: Record<FontStyleType, string> = {
  light: 'Light',
  'light-italic': 'Light Italic',
  regular: 'Regular',
  italic: 'Italic',
  bold: 'Bold',
  'bold-italic': 'Bold Italic',
};

export const fontWeights: Record<FontStyleType, string> = {
  light: '300',
  'light-italic': '300',
  regular: '400',
  italic: '400',
  bold: '700',
  'bold-italic': '700',
};

export const fontStyleStyles: Record<FontStyleType, 'normal' | 'italic'> = {
  light: 'normal',
  'light-italic': 'italic',
  regular: 'normal',
  italic: 'italic',
  bold: 'normal',
  'bold-italic': 'italic',
};
