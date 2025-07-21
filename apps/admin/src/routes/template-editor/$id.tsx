import { TemplateEditor, TemplateEditorProvider } from '@clab/template-editor';
import type { Template } from '@clab/types';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { getTemplateById } from '@clab/firebase'; // Import the CSS for the template editor
import '@clab/template-editor/assets/index.css';

export const Route = createFileRoute('/template-editor/$id')({
  component: RouteComponent,
});

// TODO: add loading state and handle error when template not found
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
