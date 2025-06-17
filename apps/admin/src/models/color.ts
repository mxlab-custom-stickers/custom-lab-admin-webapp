export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description?: string;

  colors: Color[];

  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}
