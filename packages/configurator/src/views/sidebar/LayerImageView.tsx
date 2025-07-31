import ImagePickerDialog from '@/components/images/ImagePickerDialog.tsx';
import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import { IMAGES_FIXTURE } from '@/fixtures/images.fixture.ts';
import { activateImage, drawImage } from '@/utils/canvas/image.ts';
import { addImage, createImageFromFile, updateImage } from '@/utils/layer-image-helpers.ts';
import type { FileNode } from '@clab/firebase';
import { isLayerImage } from '@clab/types';

export default function LayerImageView({ className }: { className?: string }) {
  const { currentLayer, performConfigurationUpdate, setConfiguration, canvasCenterPos } =
    useConfigurator();
  if (!isLayerImage(currentLayer)) return null;

  function handleImagePick(file: FileNode) {
    if (!currentLayer) {
      console.error('Cannot add image: no current layer selected');
      return;
    }

    // Create a new image object from the file, centered on the canvas
    const newImage = createImageFromFile(file, currentLayer.id, canvasCenterPos);

    performConfigurationUpdate(
      (prev) => addImage(prev, newImage),
      (canvas, config) =>
        drawImage(canvas, newImage)
          .then((fabricImage) => {
            console.debug('Image added to canvas:', newImage.id);
            canvas.setActiveObject(fabricImage);
            activateImage(canvas, newImage, {
              onModified: (modifiedImage) => setConfiguration(updateImage(config, modifiedImage)),
            });
          })
          .catch((err) => {
            console.error('Error adding image to canvas:', err);
            // TODO: Handle error appropriately, e.g., show a notification and rollback
          })
    );
  }

  return (
    <div className={className}>
      <ImagePickerDialog images={IMAGES_FIXTURE} onImagePick={handleImagePick}>
        Bibliothèque d'images
      </ImagePickerDialog>
    </div>
  );
}
