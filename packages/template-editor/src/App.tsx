import TemplateEditor from '@/components';
import { TemplateEditorProvider } from '@/contexts/template-editor-context.tsx';
import { getTemplateById } from '@clab/firebase';
import type { Template } from '@clab/types';
import { useEffect, useState } from 'react';

const TEMPLATE_ID = '7aGiCh9Gvngl1CZPTNY3p';

export default function App() {
  const [template, setTemplate] = useState<Template>();

  useEffect(() => {
    getTemplateById(TEMPLATE_ID).then(setTemplate);
  }, []);

  return template ? (
    <TemplateEditorProvider template={template}>
      <TemplateEditor />
    </TemplateEditorProvider>
  ) : (
    <div>Chargement...</div>
  );
}
