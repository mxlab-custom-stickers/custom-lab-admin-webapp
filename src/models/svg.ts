export interface SvgLayer {
  id: string;
  type: string;
  color?: string;
  children?: SvgLayer[];
}
