import { cn } from '@/lib/utils.ts';
import { Template } from '@/models/template.ts';
import { Link } from '@tanstack/react-router';
import React from 'react';
import TemplateStatusBadge from './TemplateStatusBadge';

type TemplateCardProps = React.ComponentPropsWithoutRef<'div'> & {
  template: Template;
};

export default function TemplateCard({
  className,
  template,
  ...props
}: TemplateCardProps) {
  return (
    <Link to="/template-editor/$id" params={{ id: template.id }}>
      <div
        className={cn(
          'group flex cursor-pointer flex-col justify-between gap-3 overflow-hidden rounded-md border bg-gray-50 p-3 shadow',
          className
        )}
        {...props}
      >
        <img
          className="duration-200 group-hover:scale-110"
          src={template.svgUrl}
          alt={template.name}
        />

        <div className="text-center">
          <TemplateStatusBadge status={template.status} />
          <h2 className="mt-1 font-medium group-hover:underline">
            {template.name}
          </h2>
        </div>
      </div>
    </Link>
  );
}
