import TemplateEditor from '@/components/template-editor/TemplateEditor.tsx';
import { TemplateEditorProvider } from '@/contexts/template-editor/template-editor-context.tsx';
import { getTemplateById } from '@/lib/firebase/firestore.ts';
import { Template } from '@/models/template.ts';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/template-editor/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const [template, setTemplate] = useState<Template | undefined>();

  useEffect(() => {
    getTemplateById(id).then(setTemplate);
  }, [id]);

  return template ? (
    <TemplateEditorProvider template={template}>
      <TemplateEditor />
    </TemplateEditorProvider>
  ) : (
    <div>Chargement...</div>
  );
}
