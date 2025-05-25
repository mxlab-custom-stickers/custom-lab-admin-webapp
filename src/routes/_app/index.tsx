import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <div>Bonjour Nelson ✌️</div>
      <div>Bienvenue sur Custom Lab.</div>
    </div>
  );
}
