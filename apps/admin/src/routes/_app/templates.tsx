import Header from '@/components/layout/Header.tsx';
import MainContent from '@/components/layout/MainContent.tsx';
import TemplateCard from '@/components/templates/TemplateCard.tsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb.tsx';
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
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                Templates
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button asChild className="ml-auto">
          <Link to="/template-editor">
            <Plus /> Nouveau template
          </Link>
        </Button>
      </Header>
      <MainContent>
        {templates.length ? (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            Aucun template trouvé
          </div>
        )}
      </MainContent>
    </div>
  );
}
