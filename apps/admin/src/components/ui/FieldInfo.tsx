import { cn } from '@clab/utils';
import type { AnyFieldApi } from '@tanstack/react-form';

type FieldInfoProps = {
  className?: string;
  field: AnyFieldApi;
};

export default function FieldInfo({ className, field }: FieldInfoProps) {
  const errorMessage =
    typeof field.state.meta.errors[0] === 'object'
      ? field.state.meta.errors[0].message
      : field.state.meta.errors[0];

  return !field.state.meta.isValid ? (
    <em
      id={`${field.name}-error`}
      className={cn('text-destructive mt-1 text-sm not-italic', className)}
    >
      {errorMessage}
    </em>
  ) : null;
}
