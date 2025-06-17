import { Badge } from '@/components/ui/badge.tsx';
import { cn } from '@/lib/utils.ts';
import { Status } from '@/models/common.ts';

export const statusLabels: Record<Status, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  archived: 'Archivé',
};
export const statusColors: Record<Status, string> = {
  active: 'bg-emerald-400 text-white',
  inactive: 'bg-rose-400 text-white',
  archived: 'bg-gray-400 text-white',
};

export default function StatusBadge({ className, status }: { status: Status; className?: string }) {
  return <Badge className={cn(statusColors[status], className)}>{statusLabels[status]}</Badge>;
}
