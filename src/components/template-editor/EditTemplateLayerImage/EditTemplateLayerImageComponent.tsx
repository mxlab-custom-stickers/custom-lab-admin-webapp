import ImagesOptionsCard from '@/components/template-editor/EditTemplateLayerImage/ImagesOptionsCard.tsx';
import OtherOptionsCard from '@/components/template-editor/EditTemplateLayerImage/OtherOptionsCard.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { isTemplateLayerImage } from '@/models/template.ts';
import ClipWithOptionsCard from './ClipWithOptionsCard.tsx';

export default function EditTemplateLayerImageComponent() {
  const { currentLayer } = useTemplateEditorContext();

  if (!currentLayer || isTemplateLayerImage(currentLayer)) return null;

  return (
    <div className="flex flex-col gap-3">
      <ImagesOptionsCard />
      <ClipWithOptionsCard />
      <OtherOptionsCard />
    </div>
  );
}
