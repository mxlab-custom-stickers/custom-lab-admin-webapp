import Header from '@/components/layout/Header.tsx';
import MainContent from '@/components/layout/MainContent.tsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb.tsx';
import TypographyH1 from '@/components/ui/typography/TypographyH1.tsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>

      <MainContent>
        <TypographyH1 className="mb-4">Bonjour Nelson 👋</TypographyH1>
        <div>Bienvenue sur Custom Lab 2 🔥</div>
      </MainContent>
    </div>
  );
}
