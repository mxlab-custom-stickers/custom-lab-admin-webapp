import ColorElementList from '@/components/configurator/ColorElementList.tsx';
import ColorGroup from '@/components/configurator/ColorGroup.tsx';
import ColorPicker from '@/components/configurator/ColorPicker.tsx';
import BackButton from '@/components/ui/BackButton.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { useOptionalTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils.ts';
import { Color } from '@/models/color.ts';
import * as React from 'react';
import ColorItem from './ColorItem';

type ConfiguratorSidebarProps = React.ComponentPropsWithoutRef<'div'>;

export default function ConfiguratorSidebar({
  className,
  ...props
}: ConfiguratorSidebarProps) {
  const {
    currentLayer,
    currentColorElement,
    setCurrentColorElementId,
    updateColorElement,
  } = useConfiguratorContext();

  const templateEditorContext = useOptionalTemplateEditorContext();

  function goBack() {
    if (!currentColorElement) return;
    const { parentId } = currentColorElement;
    if (!parentId) return;
    setCurrentColorElementId(parentId);
  }

  function handleCurrentLayerNameChange(name: string) {
    if (!templateEditorContext) return;
    if (!currentLayer) return;

    templateEditorContext.updateCurrentLayer({
      ...currentLayer,
      name,
    });
  }

  function handleColorSelect(color: Color) {
    if (!currentColorElement || currentColorElement.type !== 'item') return;
    updateColorElement({ ...currentColorElement, color });
  }

  return (
    <div className={cn('w-64 border-r bg-gray-50 p-2', className)} {...props}>
      {currentLayer && !currentColorElement ? (
        <>
          <div className="mb-2 flex items-center">
            <InvisibleInput
              className="!text-lg font-semibold"
              value={currentLayer?.name}
              onSubmit={handleCurrentLayerNameChange}
            />
          </div>
          <ColorElementList
            colorElements={currentLayer.colorElements}
            onColorElementClick={(colorElement) =>
              setCurrentColorElementId(colorElement.id)
            }
          />
        </>
      ) : null}

      {currentColorElement ? (
        <BackButton className="mb-3" onClick={goBack} />
      ) : null}

      <ColorGroup />
      <ColorItem />
      {currentLayer && currentColorElement?.type === 'item' ? (
        <ColorPicker
          className="mt-6"
          colors={currentLayer.config.availableColors}
          columns={currentLayer.config.columns}
          space={currentLayer.config.space}
          selectedColor={currentColorElement.color}
          onSelectColor={handleColorSelect}
        />
      ) : null}
    </div>
  );
}
