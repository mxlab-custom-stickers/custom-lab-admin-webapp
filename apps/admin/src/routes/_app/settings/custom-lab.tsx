import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/settings/custom-lab')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/settings/custom-lab"!</div>;
}
