import ColorElementList from '@/components/configurator/ColorElementList.tsx';
import ColorGroup from '@/components/configurator/ColorGroup.tsx';
import ColorPicker from '@/components/configurator/ColorPicker.tsx';
import BackButton from '@/components/ui/BackButton.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { findColorElementById } from '@/lib/configurator.ts';
import { cn } from '@/lib/utils.ts';
import * as React from 'react';
import ColorItem from './ColorItem';

type ConfiguratorSidebarProps = React.ComponentPropsWithoutRef<'div'>;

export default function ConfiguratorSidebar({
  className,
  ...props
}: ConfiguratorSidebarProps) {
  const {
    state: { currentLayer, currentColorElement },
    updateCurrentLayer,
    setCurrentColorElement,
  } = useConfiguratorContext();

  function goBack() {
    if (!currentLayer || !currentColorElement) return;

    const { parentId } = currentColorElement;
    if (parentId === currentLayer?.id) {
      setCurrentColorElement(undefined);
    } else {
      setCurrentColorElement(
        findColorElementById(currentLayer.colorElements, parentId)
      );
    }
  }

  function handleCurrentLayerNameChange(name: string) {
    if (!currentLayer || !updateCurrentLayer) return;

    updateCurrentLayer({ ...currentLayer, name });
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
            onColorElementClick={setCurrentColorElement}
          />
        </>
      ) : null}

      {currentColorElement ? (
        <BackButton className="mb-3" onClick={goBack} />
      ) : null}

      <ColorGroup />
      <ColorItem />
      <ColorPicker className="mt-6" />
    </div>
  );
}
