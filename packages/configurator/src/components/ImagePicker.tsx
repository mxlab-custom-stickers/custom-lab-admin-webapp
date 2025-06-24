import type { FileNode } from '@clab/firebase';
import { cn } from '@clab/utils';
import React from 'react';

type ImagePickerProps = React.ComponentPropsWithoutRef<'div'> & {
  images: FileNode[];
  onImagePick: (image: FileNode) => void;
};

export default function ImagePicker({
  className,
  images,
  onImagePick,
  ...props
}: ImagePickerProps) {
  return (
    <div className={cn('grid grid-cols-8 gap-2', className)} {...props}>
      {images.map((image) => (
        <div
          key={image.url}
          className="group aspect-square w-full cursor-pointer rounded border bg-gray-300 p-1"
          onClick={() => onImagePick(image)}
        >
          <img
            className="object-contain duration-100 group-hover:scale-110"
            src={image.url}
            alt={image.name}
          />
        </div>
      ))}
    </div>
  );
}
