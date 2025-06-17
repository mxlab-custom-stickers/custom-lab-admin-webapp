import FontFormDialog from '@/components/fonts/FontFormDialog.tsx';
import FontList from '@/components/fonts/FontList.tsx';
import Header from '@/components/layout/Header.tsx';
import MainContent from '@/components/layout/MainContent.tsx';
import { SearchInput } from '@/components/ui/SearchInput.tsx';
import Spinner from '@/components/ui/Spinner.tsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb.tsx';
import { useFonts } from '@/hooks/use-fonts.ts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/fonts/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { fonts, loading, search, setSearch } = useFonts();

  return (
    <div>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">Polices</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <FontFormDialog className="ml-auto" />
      </Header>

      <MainContent>
        {loading ? (
          <div className="grid h-full w-full place-items-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <SearchInput
              placeholder="Rechercher une police..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {fonts.length ? (
              <FontList fonts={fonts} />
            ) : (
              <div className="text-muted-foreground pt-4 text-sm">Aucune police trouvée</div>
            )}
          </div>
        )}
      </MainContent>
    </div>
  );
}
