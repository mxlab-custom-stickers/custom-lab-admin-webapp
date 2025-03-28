import TemplateEditor from '@/components/template-editor/TemplateEditor.tsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/template-editor/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <TemplateEditor />;
}
