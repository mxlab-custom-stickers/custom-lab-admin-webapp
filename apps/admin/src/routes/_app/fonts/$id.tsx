import FontStyleList from '@/components/fonts/FontStyleList.tsx';
import Header from '@/components/layout/Header.tsx';
import MainContent from '@/components/layout/MainContent.tsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import StatusBadge from '@/components/ui/StatusBadge.tsx';
import TypographyH1 from '@/components/ui/typography/TypographyH1.tsx';
import TypographyH2 from '@/components/ui/typography/TypographyH2.tsx';
import { getFontById } from '@/lib/firebase/firestore.ts';
import { loadFont } from '@/lib/fonts.ts';
import { Font } from '@/models/text.ts';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_app/fonts/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const [font, setFont] = useState<Font | undefined>();
  const [previewText, setPreviewText] = useState<string>('');

  useEffect(() => {
    const initFont = async () => {
      if (!id) return;

      try {
        const fontData = await getFontById(id);
        if (!fontData) {
          console.error(`Font with id ${id} not found`);
          return;
        }

        await loadFont(fontData);
        setFont(fontData);
        await loadFont(fontData);
      } catch (error) {
        console.error(`Error loading font with id ${id}:`, error);
      }
    };

    initFont();
  }, [id]);

  return font ? (
    <div>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/fonts">Polices</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/fonts/$id" params={{ id: font?.id }}>
                  {font?.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button className="ml-auto" disabled>
          Modifier
        </Button>
      </Header>

      <MainContent>
        <div className="flex items-center">
          <TypographyH1 className="mr-4">{font.name}</TypographyH1>
          <StatusBadge status={font.status} />
        </div>

        <div className="p-12 text-center text-4xl" style={{ fontFamily: font.name }}>
          Custom Lab 2 by MXlab, the best configurator for your graphic kits.
        </div>

        <TypographyH2 className="mb-2">Styles</TypographyH2>
        <Input
          className="mb-6 max-w-xl"
          placeholder="Entre un texte de prévisualisation"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
        />
        <FontStyleList font={font} previewText={previewText} />
      </MainContent>
    </div>
  ) : null;
}
