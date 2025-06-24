import ImagePicker from '@/components/ImagePicker.tsx';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogTrigger } from '@/components/ui/dialog.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts';
import { drawImageOnCanvas } from '@/utils/fabric.ts';
import { type FileNode, listFiles } from '@clab/firebase';
import { type Image, isTemplateLayerImage } from '@clab/types';
import { generateId } from '@clab/utils';
import { Image as ImageLucide } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LayerImageComponent() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    state: { canvas },
    currentLayer,
    updateLayer,
  } = useConfiguratorContext();

  if (!currentLayer || !isTemplateLayerImage(currentLayer)) return null;

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
              <DialogTitle className="sr-only">Bibliothèque d'images</DialogTitle>
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
