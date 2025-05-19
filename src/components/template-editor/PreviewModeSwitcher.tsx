import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import {
  PreviewMode,
  useTemplateEditorContext,
} from '@/contexts/template-editor-context.ts';
import { Fullscreen, Monitor, Smartphone } from 'lucide-react';

export default function PreviewModeSwitcher({
  className,
}: {
  className?: string;
}) {
  const { previewMode, setPreviewMode } = useTemplateEditorContext();

  return (
    <ToggleGroup
      className={className}
      type="single"
      variant="outline"
      value={previewMode}
      onValueChange={(value) => {
        if (value) setPreviewMode(value as PreviewMode);
      }}
    >
      <ToggleGroupItem value="desktop" aria-label="Toggle desktop preview mode">
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="mobile" aria-label="Toggle mobile preview mode">
        <Smartphone className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="fullscreen"
        aria-label="Toggle fullscreen preview mode"
      >
        <Fullscreen className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
