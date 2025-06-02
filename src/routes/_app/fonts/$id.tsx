import Header from '@/components/layout/Header.tsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx';
import { getFontById } from '@/lib/firebase/firestore.ts';
import { Font } from '@/models/text.ts';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_app/fonts/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const [font, setFont] = useState<Font | undefined>();

  useEffect(() => {
    getFontById(id).then(
      (font) => setFont(font),
      (error) => console.error(error)
    );
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
      </Header>

      <div className="pt-4">
        <h1 className="text-2xl font-semibold">{font.name}</h1>
      </div>
    </div>
  ) : null;
}
