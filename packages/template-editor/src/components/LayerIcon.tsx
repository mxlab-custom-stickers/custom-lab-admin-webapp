import type { TemplateLayerType } from '@clab/types';
import { Image, type LucideIcon, type LucideProps, Palette, Type, Wallpaper } from 'lucide-react';

const layerIcons: Record<TemplateLayerType, LucideIcon> = {
  color: Palette,
  image: Image,
  text: Type,
  background: Wallpaper,
};

type LayerIconProps = LucideProps & {
  type: TemplateLayerType;
};

export default function LayerIcon({ type, ...props }: LayerIconProps) {
  const Icon = layerIcons[type];

  return <Icon {...props} />;
}
