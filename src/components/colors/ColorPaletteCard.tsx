import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { ColorPalette } from '@/models/color.ts';

type ColorPaletteCardProps = {
  colorPalette: ColorPalette;
};

export default function ColorPaletteCard({
  colorPalette,
}: ColorPaletteCardProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{colorPalette.name}</CardTitle>
        {colorPalette.description ? (
          <CardDescription>{colorPalette.description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {colorPalette.colors.map((color) => (
            <div
              key={color.id}
              className="h-9 w-9 rounded"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
