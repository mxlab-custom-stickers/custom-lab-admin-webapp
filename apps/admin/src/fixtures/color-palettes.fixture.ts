import { COLORS_FIXTURE } from '@/fixtures/colors.fixture.ts';
import { ColorPalette } from '@/models/color.ts';

export const COLOR_PALETTES_FIXTURE: ColorPalette[] = [
  {
    id: 'all',
    name: 'Tout',
    description: 'Toutes les couleurs',

    colors: COLORS_FIXTURE,

    createdAt: '2025-01-02T23:59:59.999Z',
    createdBy: 'Nelson',
  },
  {
    id: 'kits_deco_moto',
    name: 'Kits déco moto',
    description: 'Pour les kits déco moto',

    colors: COLORS_FIXTURE.slice(0, COLORS_FIXTURE.length / 2),

    createdAt: '2025-02-17T23:59:59.999Z',
    createdBy: 'Nelson',
  },
  {
    id: 'kits_deco_casque',
    name: 'Kits déco casque',
    description: 'Pour les kits déco casque',

    colors: COLORS_FIXTURE.slice(COLORS_FIXTURE.length / 2, COLORS_FIXTURE.length - 7),

    createdAt: '2025-03-02T23:59:59.999Z',
    createdBy: 'Bastien',
  },
];
