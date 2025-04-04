import { Color } from '@/models/color.ts';
import { TemplateLayerColor } from '@/models/template.ts';

export function getAllAvailableColors(
  templateLayerColor: TemplateLayerColor
): Color[] {
  return templateLayerColor.config.availableColors.concat(
    templateLayerColor.config.availableColorPalettes
      .map((colorPalette) => colorPalette.colors)
      .flat()
  );
}
