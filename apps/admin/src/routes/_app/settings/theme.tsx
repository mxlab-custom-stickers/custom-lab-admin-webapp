import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/settings/theme')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/settings/theme"!</div>
}
