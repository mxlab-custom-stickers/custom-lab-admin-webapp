import ColorElementList from '@/components/configurator/ColorElementList.tsx';
import ColorPaletteCard from '@/components/configurator/ColorPaletteCard.tsx';
import CurrentColorElement from '@/components/configurator/CurrentColorElement.tsx';
import FocusSection from '@/components/configurator/FocusSection.tsx';
import BackButton from '@/components/ui/BackButton.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { useOptionalTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils.ts';
import * as React from 'react';

type ConfiguratorSidebarProps = React.ComponentPropsWithoutRef<'div'>;

export default function ConfiguratorSidebar({
  className,
  ...props
}: ConfiguratorSidebarProps) {
  const { currentLayer, currentColorElement, setCurrentColorElementId } =
    useConfiguratorContext();

  const templateEditorContext = useOptionalTemplateEditorContext();

  function goBack() {
    if (!currentColorElement) return;
    const { parentId } = currentColorElement;
    setCurrentColorElementId(parentId);
  }

  function handleCurrentLayerNameChange(name: string) {
    if (!templateEditorContext) return;
    if (!currentLayer) return;

    templateEditorContext.updateLayer({
      ...currentLayer,
      name,
    });
  }

  return (
    <div className={cn('w-64 border-r bg-gray-50 p-2', className)} {...props}>
      {currentLayer && !currentColorElement ? (
        <>
          <div className="my-2 flex items-center">
            <InvisibleInput
              className="!text-lg font-semibold"
              value={currentLayer?.name}
              onSubmit={handleCurrentLayerNameChange}
            />
          </div>

          <FocusSection />

          {currentLayer.config.enableColorPalette ? (
            <div>
              <ColorPaletteCard
                onClick={() => setCurrentColorElementId('color-palette')}
              />
              <div className="my-2 grid grid-cols-[40%_20%_40%] items-center px-3">
                <Separator />
                <span className="upercase text-center text-sm font-medium">
                  ou
                </span>
                <Separator />
              </div>
              <div className="text-muted-foreground p-2 text-xs">
                Modifie les couleurs par éléments
              </div>
            </div>
          ) : null}

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

      <CurrentColorElement />
    </div>
  );
}
