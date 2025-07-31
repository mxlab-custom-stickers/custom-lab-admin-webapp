import type { FileNode } from '@clab/firebase';
import { useState } from 'react';

export type ImageFilters = {
  search: string;
  startsWith: string;
};

export function useImageFilters(initialImages: FileNode[]) {
  const [images, setImages] = useState<FileNode[]>(initialImages);

  const [filters, _setFilters] = useState<ImageFilters>({
    search: '',
    startsWith: '',
  });

  function setFilters(newFilters: Partial<ImageFilters>) {
    _setFilters((prev) => {
      const updatedFilters = { ...prev, ...newFilters };

      // Filter images based on the updated filters
      const filteredImages = initialImages.filter((image) => {
        const matchesSearch = image.name
          .toLowerCase()
          .includes(updatedFilters.search.toLowerCase());
        const matchesStartsWith =
          !updatedFilters.startsWith ||
          image.name.startsWith(updatedFilters.startsWith[0]) ||
          image.name.startsWith(updatedFilters.startsWith[1]);
        return matchesSearch && matchesStartsWith;
      });

      setImages(filteredImages);
      return updatedFilters;
    });
  }

  return { images, filters, setFilters };
}
