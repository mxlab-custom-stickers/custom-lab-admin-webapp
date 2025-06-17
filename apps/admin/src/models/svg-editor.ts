export interface SvgLayer {
  id: string;
  type: string;
  color?: string;
  parentId?: string;
  children?: SvgLayer[];
}
