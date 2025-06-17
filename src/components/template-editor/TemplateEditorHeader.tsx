import DownloadSvgButton from '@/components/template-editor/DownloadSvgButton.tsx';
import PreviewModeSwitcher from '@/components/template-editor/PreviewModeSwitcher.tsx';
import TemplateStatusBadge from '@/components/templates/TemplateStatusBadge.tsx';
import { Button } from '@/components/ui/button.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import QuitButton from '@/components/ui/QuitButton.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { Loader2, Save } from 'lucide-react';

export default function TemplateEditorHeader() {
  const {
    state: { template, isDirty, isSaving },
    updateTemplate,
    saveTemplateState,
  } = useTemplateEditorContext();

  return (
    <header className="grid h-14 shrink-0 grid-cols-3 items-center gap-2 border-b px-4">
      <div>
        <QuitButton />
      </div>

      <InvisibleInput
        className="text-center !text-lg font-medium"
        value={template.name}
        onValueSubmit={(name) => updateTemplate({ ...template, name })}
      />

      <div className="flex items-center justify-end gap-2">
        <PreviewModeSwitcher />

        <Separator orientation="vertical" className="ml-2 !h-6" />

        <DownloadSvgButton />

        <Separator orientation="vertical" className="mr-2 !h-6" />

        <TemplateStatusBadge status={template.status} />
        <Button
          className="text-xs"
          size="sm"
          onClick={saveTemplateState}
          disabled={!isDirty || isSaving}
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
          Enregistrer
        </Button>
      </div>
    </header>
  );
}
