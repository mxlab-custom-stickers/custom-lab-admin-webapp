import ImagePickerFilters from '@/components/images/ImagePickerFilters.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { useImageFilters } from '@/hooks/use-image-filters.ts';
import { type FileNode } from '@clab/firebase';
import { cn } from '@clab/utils';
import React, { useState } from 'react';

type ImagePickerDialogProps = {
  children?: React.ReactNode;
  images: FileNode[];
  onImagePick: (image: FileNode) => void;
};

export default function ImagePickerDialog({
  children,
  images: initialImages,
  onImagePick,
}: ImagePickerDialogProps) {
  const { images, filters, setFilters } = useImageFilters(initialImages);

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-base uppercase">{children}</Button>
      </DialogTrigger>
      <DialogContent className="w-5xl flex h-[90svh] !max-w-[90svw] flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Sélecteur d'image</DialogTitle>
          <DialogDescription>
            Sélectionnez une image à ajouter à votre configuration.
          </DialogDescription>
        </DialogHeader>
        {/* Filters */}
        <ImagePickerFilters className="p-4" value={filters} onValueChange={setFilters} />
        {/* Image list */}
        <div className="scrollbar-thin scrollbar-thumb-[#323232] scrollbar-track-transparent h-full overflow-auto p-4">
          <div className={cn('grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8')}>
            {images
              .concat(images)
              .concat(images)
              .concat(images)
              .map((image, index) => (
                <div
                  key={image.url + index}
                  className="group aspect-square w-full cursor-pointer rounded bg-[#454545] p-2"
                  onClick={() => {
                    onImagePick(image);
                    setOpen(false);
                  }}
                >
                  <img
                    className="object-contain duration-100 group-hover:scale-110"
                    src={image.url}
                    alt={image.name}
                  />
                </div>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
