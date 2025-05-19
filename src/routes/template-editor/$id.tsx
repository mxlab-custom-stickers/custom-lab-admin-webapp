import TemplateEditor from '@/components/template-editor/TemplateEditor.tsx';
import { Template } from '@/models/template.ts';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/template-editor/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const [template, setTemplate] = useState<Template | undefined>(getTemplate);

  function getTemplate(): Template | undefined {
    const json = localStorage.getItem(`template:${id}`);
    if (json) {
      return JSON.parse(json) as Template;
    }
    return undefined;
  }

  function handleTemplateChange(updatedTemplate: Template) {
    setTemplate(updatedTemplate);
    localStorage.setItem(
      `template:${updatedTemplate.id}`,
      JSON.stringify(updatedTemplate)
    );
  }

  return template ? (
    <TemplateEditor
      template={template}
      onTemplateChange={handleTemplateChange}
    />
  ) : (
    <Navigate to={'/template-editor'} />
  );
}
