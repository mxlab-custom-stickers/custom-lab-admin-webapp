import { Badge } from '@/components/ui/badge.tsx';
import { Template } from '@/models/template.ts';

type TemplateStatusBadgeProps = {
  status: Template['status'];
};

const statusLabels: Record<Template['status'], string> = {
  draft: 'Brouillon',
  published: 'Publié',
  archived: 'Archivé',
};

const statusColors: Record<Template['status'], string> = {
  draft: 'bg-sky-500',
  published: 'bg-green-500',
  archived: 'bg-gray-500',
};

export default function TemplateStatusBadge({
  status,
}: TemplateStatusBadgeProps) {
  return <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>;
}
