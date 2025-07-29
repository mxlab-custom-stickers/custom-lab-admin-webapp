import { Button } from '@/components/ui/button.tsx';
import { Toggle } from '@/components/ui/toggle.tsx';
import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { CopyPlus, LockOpen, Trash } from 'lucide-react';

export function TopControlsBox({ x, y }: { x: number; y: number }) {
  const { selectedObject, deleteSelectedObject, updateImage, updateText } = useConfigurator();
  if (!selectedObject) return null;

  const { lockFabricObject, removeFabricObject } = useCanvas();

  function handleLockToggle(toggle: boolean) {
    if (!selectedObject) return;

    if (selectedObject.type === 'image' && selectedObject.image.fabricObject) {
      lockFabricObject(selectedObject.image.fabricObject, toggle);
      updateImage({ ...selectedObject.image, locked: toggle });
    } else if (selectedObject.type === 'text' && selectedObject.text.fabricObject) {
      lockFabricObject(selectedObject.text.fabricObject, toggle);
      updateText({ ...selectedObject.text, locked: toggle });
    }
  }

  function handleDelete() {
    if (!selectedObject) return;

    if (selectedObject.type === 'image' && selectedObject.image.fabricObject) {
      removeFabricObject(selectedObject.image.fabricObject);
    } else if (selectedObject.type === 'text' && selectedObject.text.fabricObject) {
      removeFabricObject(selectedObject.text.fabricObject);
    }

    deleteSelectedObject();
  }

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
          pressed={selectedObject.locked ?? false}
          onPressedChange={(pressed) => handleLockToggle(pressed)}
        >
          <LockOpen className="!h-4.5 !w-4.5" />
        </Toggle>
        {!selectedObject.locked ? (
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
