import Dropzone from '@/components/ui/Dropzone.tsx';
import QuitButton from '@/components/ui/QuitButton.tsx';
import { useAppContext } from '@/contexts/app-context.ts';
import { addTemplate } from '@/lib/firebase/firestore.ts';
import { uploadFile } from '@/lib/firebase/storage.ts';
import { generateId } from '@/lib/nanoid.ts';
import { Template } from '@/models/template.ts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/template-editor/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [loading, setLoading] = useState<boolean>(false);

  const { currentApp } = useAppContext();

  const navigate = useNavigate({ from: '/template-editor' });

  async function handleDrop(files: File[]) {
    if (!files[0]) return;
    setLoading(true);

    const id = generateId();

    // Upload the SVG file to Firebase Storage
    const svgUrl = await uploadFile(files[0], `${currentApp.id}/Template SVGs/${id}`);

    // Use the file name without the extension as the default template name
    const fileName = files[0].name;

    const newTemplate: Template = {
      appId: currentApp.id,
      id,
      name: fileName.split('.svg')[0],
      status: 'draft',
      svgUrl,
      layers: [],
      tags: [],
      attributes: [],
      createdAt: new Date().toISOString(),
      createdBy: 'Nelson',
    };

    await addTemplate(newTemplate);
    setLoading(false);

    navigate({ to: '/template-editor/$id', params: { id } });
  }

  return (
    <div className="relative grid h-screen w-screen place-items-center bg-black/40">
      <QuitButton className="absolute left-6 top-6" variant="secondary" />

      <Dropzone className="aspect-4/2 w-[600px]" onDrop={handleDrop} loading={loading}>
        Importe ton fichier svg ici
      </Dropzone>
    </div>
  );
}
