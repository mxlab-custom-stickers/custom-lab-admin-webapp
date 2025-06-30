import { Button } from '@/components/ui/button.tsx';
import { Toggle } from '@/components/ui/toggle.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { CopyPlus, LockOpen, Trash } from 'lucide-react';

export function TopControlsBox({ x, y }: { x: number; y: number }) {
  const { selectedObject, deleteSelectedObject, updateImage, updateText } =
    useConfiguratorContext();
  const { lockFabricObject, removeFabricObject } = useCanvas();

  function handleLockToggle(toggle: boolean) {
    if (!selectedObject) return;

    if (selectedObject.type === 'image' && selectedObject.image.fabricImage) {
      lockFabricObject(selectedObject.image.fabricImage, toggle);
      updateImage({ ...selectedObject.image, locked: toggle });
    } else if (selectedObject.type === 'text' && selectedObject.text.fabricTextbox) {
      lockFabricObject(selectedObject.text.fabricTextbox, toggle);
      updateText({ ...selectedObject.text, locked: toggle });
    }
  }

  function handleDelete() {
    if (!selectedObject) return;

    if (selectedObject.type === 'image' && selectedObject.image.fabricImage) {
      removeFabricObject(selectedObject.image.fabricImage);
    } else if (selectedObject.type === 'text' && selectedObject.text.fabricTextbox) {
      removeFabricObject(selectedObject.text.fabricTextbox);
    }

    deleteSelectedObject();
  }

  const isLocked =
    selectedObject?.type === 'image'
      ? selectedObject.image.locked
      : selectedObject?.type === 'text'
        ? selectedObject.text.locked
        : false;

  return (
    <div
      className="absolute flex gap-0 rounded-md bg-white/90 p-1 shadow-lg"
      style={{
        top: y,
        left: x,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'auto',
      }}
    >
      <>
        {/* Lock toggle */}
        <Toggle
          className="data-[state=on]:bg-primary data-[state=on]:hover:bg-primary/75 aspect-square p-1 hover:bg-gray-100 hover:text-black"
          pressed={isLocked ?? false}
          onPressedChange={(pressed) => handleLockToggle(pressed)}
        >
          <LockOpen className="!h-4.5 !w-4.5" />
        </Toggle>
        {!isLocked ? (
          <>
            {/* Duplicate */}
            <Button
              className="aspect-square !p-1 hover:!bg-gray-100 hover:!text-black"
              variant="ghost"
            >
              <CopyPlus className="!h-4.5 !w-4.5" />
            </Button>
            {/* Delete */}
            <Button
              className="aspect-square !p-1 hover:!bg-gray-100 hover:!text-black"
              variant="ghost"
              onClick={handleDelete}
            >
              <Trash className="!h-4.5 !w-4.5" />
            </Button>
          </>
        ) : null}
      </>
    </div>
  );
}
