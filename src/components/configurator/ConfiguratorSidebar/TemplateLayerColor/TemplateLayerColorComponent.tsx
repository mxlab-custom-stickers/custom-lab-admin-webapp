import ColorElementList from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorElementList.tsx';
import ColorPaletteCard from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorPaletteCard.tsx';
import CurrentColorElement from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/CurrentColorElement.tsx';
import FocusSection from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/FocusSection.tsx';
import BackButton from '@/components/ui/BackButton.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { useOptionalTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';

export default function TemplateLayerColorComponent() {
  const { currentLayer, currentColorElement, setCurrentColorElementId } =
    useConfiguratorContext();

  const templateEditorContext = useOptionalTemplateEditorContext();

  if (currentLayer?.type !== 'color') return null;

  function handleNameChange(name: string) {
    if (!templateEditorContext) return;
    if (!currentLayer) return;

    templateEditorContext.updateLayer({
      ...currentLayer,
      name,
    });
  }

  function goBack() {
    if (!currentColorElement) return;
    const { parentId } = currentColorElement;
    setCurrentColorElementId(parentId);
  }

  return (
    <div>
      {!currentColorElement ? (
        <>
          <div className="my-2 flex items-center">
            <InvisibleInput
              className="!text-lg font-semibold"
              value={currentLayer.name}
              onSubmit={handleNameChange}
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
      ) : (
        <>
          <BackButton className="mb-3" onClick={goBack} />
          <CurrentColorElement />
        </>
      )}
    </div>
  );
}
