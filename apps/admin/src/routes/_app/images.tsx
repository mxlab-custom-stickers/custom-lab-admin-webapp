import Header from '@/components/layout/Header.tsx';
import MainContent from '@/components/layout/MainContent.tsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb.tsx';
import { useAppContext } from '@/contexts/app-context.ts';
import { FileNode, FolderNode, listFiles } from '@/lib/firebase/storage.ts';
import { createFileRoute } from '@tanstack/react-router';
import { EllipsisVertical, Folder } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_app/images')({
  component: RouteComponent,
});

type ImagesState = {
  files: FileNode[];
  folders: FolderNode[];
};

function RouteComponent() {
  const { currentApp } = useAppContext();

  const [state, setState] = useState<ImagesState>({
    files: [],
    folders: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!currentApp) return;
    const path = `/${currentApp.id}/Images`;
    fetchPath(path);
  }, [currentApp]);

  async function fetchPath(path: string) {
    setLoading(true);
    const newState = await listFiles(path);
    setState(newState);
    setLoading(false);
  }

  return (
    <div>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">Images</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>

      <MainContent>
        <div className="flex flex-col gap-4">
          {loading ? <div>Chargement...</div> : null}

          {state.folders.length ? (
            <div>
              <h2 className="mb-2 font-medium select-none">Dossiers</h2>
              <ul className="flex flex-wrap gap-4">
                {state.folders.map((folder) => (
                  <li
                    key={folder.fullPath}
                    className="flex w-64 items-center rounded-md bg-gray-200/50 p-4 transition-colors duration-200 ease-in-out hover:bg-gray-200"
                    onDoubleClick={() => fetchPath(folder.fullPath)}
                  >
                    <Folder className="mr-3" size={24} />
                    <span className="line-clamp-1 flex-1 text-sm font-medium select-none">
                      {folder.name}
                    </span>
                    <EllipsisVertical size={18} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {state.files.length ? (
            <div>
              <h2 className="mb-2 font-medium select-none">Images</h2>
              <ul className="grid grid-cols-7 gap-4">
                {state.files.map((file) => (
                  <li key={file.name} className="rounded-md bg-gray-200/50 p-2">
                    <div className="mb-2 flex items-center">
                      <span className="line-clamp-1 flex-1 py-1 text-sm font-light">
                        {file.name}
                      </span>
                      <EllipsisVertical size={18} />
                    </div>

                    <img
                      className="aspect-square w-full rounded border border-gray-300 object-contain"
                      src={file.url}
                      alt={file.name}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </MainContent>
    </div>
  );
}
