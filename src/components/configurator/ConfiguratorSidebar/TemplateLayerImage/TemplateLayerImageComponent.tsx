import ImagePicker from '@/components/images/ImagePicker.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { drawImageOnCanvas } from '@/lib/fabric.ts';
import { FileNode, listFiles } from '@/lib/firebase/storage.ts';
import { generateId } from '@/lib/nanoid.ts';
import { Image } from '@/models/image.ts';
import { Image as ImageLucide } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TemplateLayerImageComponent() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    state: { canvas },
    currentLayer,
    updateLayer,
  } = useConfiguratorContext();

  if (currentLayer?.type !== 'image') return null;

  const [images, setImages] = useState<FileNode[]>([]);

  useEffect(() => {
    listFiles('/RwNg97gBZD8XkAE1tMFt/Images').then(({ files }) => {
      setImages(files);
    });
  }, [currentLayer.id]);

  async function handleImagePick(image: FileNode) {
    if (currentLayer?.type !== 'image' || !canvas) return;

    const newImage: Image = {
      id: generateId(),
      url: image.url,
      name: image.name,
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
    };

    const newImageWithFabricImage = await drawImageOnCanvas(canvas, newImage);

    setOpenDialog(false);

    updateLayer({
      ...currentLayer,
      images: [...currentLayer.images, newImageWithFabricImage],
    });
  }

  return (
    <div>
      <InvisibleInput
        className="my-2 !text-lg font-semibold"
        value={currentLayer.name}
      />

      <div className="p-2">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <ImageLucide className="mr-1" />
              Bibliothèque d'images
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-4xl gap-0">
            <DialogHeader>
              <DialogTitle className="sr-only">
                Bibliothèque d'images
              </DialogTitle>
              <DialogDescription className="sr-only">
                Choisissez une image à ajouter à votre configuration.
              </DialogDescription>
            </DialogHeader>

            <ImagePicker images={images} onImagePick={handleImagePick} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
