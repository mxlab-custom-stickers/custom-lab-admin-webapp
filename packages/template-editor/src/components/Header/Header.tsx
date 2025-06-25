import InvisibleInput from '@/components/forms/InvisibleInput.tsx';
import PreviewModeSwitcher from '@/components/Header/PreviewModeSwitcher.tsx';
import TemplateStatusBadge from '@/components/Header/TemplateStatusBadge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.tsx';
import { Download, Loader2, Save } from 'lucide-react';
import QuitButton from '../ui/QuitButton.tsx';

export default function Header() {
  const {
    state: { template, isDirty, isSaving },
    updateTemplate,
    saveTemplateState,
  } = useTemplateEditorContext();

  return (
    <header className="grid h-14 shrink-0 grid-cols-3 items-center gap-2 border-b px-4">
      <QuitButton className="w-min" />

      <InvisibleInput
        className="text-center !text-lg font-medium"
        defaultValue={template.name}
        onValueSubmit={(value) => updateTemplate({ ...template, name: value })}
      />

      <div className="flex items-center justify-end gap-2">
        <PreviewModeSwitcher />
        <Separator orientation="vertical" className="ml-2 !h-6" />
        <Button variant="ghost" size="icon" disabled>
          <Download />
        </Button>
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
