import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { PreviewMode } from '@/contexts/template-editor/template-editor-types.ts';
import { Fullscreen, Monitor, Smartphone } from 'lucide-react';

export default function PreviewModeSwitcher({
  className,
}: {
  className?: string;
}) {
  const {
    state: { previewMode },
    setPreviewMode,
  } = useTemplateEditorContext();

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
      {/* Desktop */}
      <ToggleGroupItem value="desktop" aria-label="Toggle desktop preview mode">
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
      {/* Mobile */}
      <ToggleGroupItem value="mobile" aria-label="Toggle mobile preview mode">
        <Smartphone className="h-4 w-4" />
      </ToggleGroupItem>
      {/* Fullscreen */}
      <ToggleGroupItem
        value="fullscreen"
        aria-label="Toggle fullscreen preview mode"
      >
        <Fullscreen className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
