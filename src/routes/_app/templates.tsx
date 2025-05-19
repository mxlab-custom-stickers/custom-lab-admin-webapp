import { Button } from '@/components/ui/button.tsx';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/_app/templates')({
  component: RouteComponent,
});

function RouteComponent() {
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
    </div>
  );
}
