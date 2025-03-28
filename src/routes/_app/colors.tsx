import ColorPaletteCard from '@/components/colors/ColorPaletteCard.tsx';
import ColorTable from '@/components/colors/ColorTable.tsx';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { COLOR_PALETTES_FIXTURE } from '@/fixtures/color-palettes.fixture.ts';
import { COLORS_FIXTURE } from '@/fixtures/colors.fixture.ts';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/_app/colors')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-2 items-start gap-4">
      <Card>
        <CardHeader className="relative">
          <CardTitle>Couleurs</CardTitle>
          <CardDescription>
            Vous avez {COLORS_FIXTURE.length} couleurs enregistrées
          </CardDescription>

          <Button className="absolute -top-2 right-4">
            <Plus />
            Nouvelle couleur
          </Button>
        </CardHeader>
        <CardContent className="max-h-[720px] overflow-auto">
          <ColorTable colors={COLORS_FIXTURE} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="relative">
          <CardTitle>Palettes</CardTitle>
          <CardDescription></CardDescription>
          <Button className="absolute -top-2 right-4">
            <Plus />
            Nouvelle palette
          </Button>
        </CardHeader>
        <CardContent className="max-h-[700px] overflow-auto">
          <div className="grid grid-cols-2 gap-4">
            {COLOR_PALETTES_FIXTURE.map((colorPalette) => (
              <ColorPaletteCard colorPalette={colorPalette} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
