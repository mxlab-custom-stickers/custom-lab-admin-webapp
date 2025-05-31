import FontFormDialog from '@/components/fonts/FontFormDialog.tsx';
import FontList from '@/components/fonts/FontList.tsx';
import Header from '@/components/layout/Header.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { SearchInput } from '@/components/ui/SearchInput.tsx';
import Spinner from '@/components/ui/Spinner';
import { useElementHeight } from '@/hooks/use-element-height.ts';
import { useFonts } from '@/hooks/use-fonts.ts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/fonts')({
  component: RouteComponent,
});

function RouteComponent() {
  const { fonts, loading, search, setSearch } = useFonts();

  const headerHeight = useElementHeight('fonts-header');

  return (
    <div>
      <Header id="fonts-header">
        <div className="grid flex-1 grid-cols-[min-content_auto_min-content] items-center gap-4">
          <h1 className="text-2xl font-semibold whitespace-nowrap">Polices</h1>
          <SearchInput
            wrapperClassName="justify-self-center"
            placeholder="Rechercher une police..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FontFormDialog />
        </div>
      </Header>

      <div
        style={{ height: `calc(100svh - ${headerHeight ?? 64}px - 8px)` }}
        className="pt-6"
      >
        {loading ? (
          <div className="grid h-full w-full place-items-center">
            <Spinner />
          </div>
        ) : fonts.length ? (
          <ScrollArea className="flex h-full flex-col pr-4">
            {/* Fading overlay at the top */}
            <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-6 bg-gradient-to-b from-white to-transparent" />
            <FontList fonts={fonts} />
            {/* Empty space at the bottom */}
            <div className="h-4" />
          </ScrollArea>
        ) : (
          <div className="text-muted-foreground text-sm">
            Aucune police trouvée
          </div>
        )}
      </div>
    </div>
  );
}
