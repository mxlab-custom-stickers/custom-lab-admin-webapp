import TemplateCard from '@/components/templates/TemplateCard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useAppContext } from '@/contexts/app-context.ts';
import { getTemplatesByAppId } from '@/lib/firebase/firestore.ts';
import { Template } from '@/models/template.ts';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_app/templates')({
  component: RouteComponent,
});

function RouteComponent() {
  const [templates, setTemplates] = useState<Template[]>([]);

  const { currentApp } = useAppContext();

  useEffect(() => {
    getTemplatesByAppId(currentApp.id).then((templates) =>
      setTemplates(templates)
    );
  }, [currentApp]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mes Templates</h1>

        <Button asChild>
          <Link to="/template-editor">
            <Plus /> Nouveau template
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
