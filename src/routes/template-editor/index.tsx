import Dropzone from '@/components/ui/Dropzone.tsx';
import QuitButton from '@/components/ui/QuitButton.tsx';
import { generateId } from '@/lib/nanoid.ts';
import { Template } from '@/models/template.ts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/template-editor/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: '/template-editor' });

  function handleDrop(files: File[]) {
    const id = generateId();
    const fileName = files[0].name;

    const newTemplate: Template = {
      id,
      name: fileName.split('.svg')[0],
      status: 'draft',
      svgUrl: `/src/assets/${fileName}`,
      layers: [],
      tags: [],
      attributes: [],
    };

    localStorage.setItem(`template:${id}`, JSON.stringify(newTemplate));
    navigate({ to: '/template-editor/$id', params: { id } });
  }

  return (
    <div className="relative grid h-screen w-screen place-items-center bg-black/40">
      <QuitButton className="absolute top-6 left-6" variant="secondary" />

      <Dropzone className="aspect-4/2 w-[600px]" onDrop={handleDrop}>
        Importe ton fichier svg ici
      </Dropzone>
    </div>
  );
}
