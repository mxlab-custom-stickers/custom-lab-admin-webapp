import { brightenHexColor } from '@/lib/colors.ts';
import { collectColorItems } from '@/lib/configurator.ts';
import { Image } from '@/models/image.ts';
import {
  ColorElement,
  ColorItem,
  TemplateLayerColor,
  TemplateLayerImage,
} from '@/models/template.ts';
import {
  Canvas,
  FabricImage,
  FabricObject,
  Group,
  loadSVGFromURL,
  Point,
} from 'fabric';

export function resizeCanvasToWrapper(canvas: Canvas, wrapperEl: HTMLElement) {
  canvas.setWidth(wrapperEl.clientWidth);
  canvas.setHeight(wrapperEl.clientHeight);
}

export function setupZoomAndPan(canvas: Canvas) {
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;

  canvas.on('mouse:wheel', (opt) => {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom() * 0.999 ** delta;
    zoom = Math.min(Math.max(zoom, 0.1), 10);
    canvas.zoomToPoint(new Point({ x: opt.e.offsetX, y: opt.e.offsetY }), zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });

  canvas.on('mouse:down', (opt) => {
    if (opt.target) return;
    isPanning = true;
    const e = opt.e as MouseEvent | TouchEvent;

    if ('clientX' in e) {
      lastPosX = e.clientX;
      lastPosY = e.clientY;
    } else if ('touches' in e && e.touches.length > 0) {
      lastPosX = e.touches[0].clientX;
      lastPosY = e.touches[0].clientY;
    }

    canvas.selection = false;
  });

  canvas.on('mouse:move', (opt) => {
    if (!isPanning) return;
    const e = opt.e as MouseEvent | TouchEvent;

    let clientX: number | undefined;
    let clientY: number | undefined;

    if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    if (clientX === undefined || clientY === undefined) return;

    const vpt = canvas.viewportTransform!;
    vpt[4] += clientX - lastPosX;
    vpt[5] += clientY - lastPosY;
    canvas.requestRenderAll();

    lastPosX = clientX;
    lastPosY = clientY;
  });

  canvas.on('mouse:up', () => {
    isPanning = false;
    canvas.selection = true;
  });
}

export async function renderSVGToCanvas(
  canvas: Canvas,
  svgUrl: string
): Promise<FabricObject[]> {
  const svgData = await loadSVGFromURL(svgUrl);
  const { options } = svgData;
  const objects = svgData.objects.filter((obj) => obj !== null);

  objects.forEach((obj) => {
    obj.set({
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
    });
    canvas.add(obj);
  });

  const scaleX = canvas.getWidth()! / options.width!;
  const scaleY = canvas.getHeight()! / options.height!;
  const scale = Math.min(scaleX, scaleY);
  canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);

  const dx =
    canvas.getWidth()! / 2 - (options.left ?? options.width! / 2) * scale;
  const dy =
    canvas.getHeight()! / 2 - (options.top ?? options.height! / 2) * scale;
  canvas.relativePan(new Point(dx, dy));

  canvas.requestRenderAll();

  return objects;
}

/**
 * Recursively updates ColorItems in a ColorElement tree by assigning matching FabricObjects
 * based on their ID.
 *
 * @param elements - An array of ColorElements (ColorItems or ColorGroups)
 * @param fabricObjects - Flat array of FabricObjects to associate by ID
 * @returns A new array of ColorElements with updated ColorItems
 */
function assignFabricObjectsToColorElements(
  elements: ColorElement[],
  fabricObjects: FabricObject[]
): ColorElement[] {
  return elements.map((element) => {
    if (element.type === 'group') {
      return {
        ...element,
        subColorElements: assignFabricObjectsToColorElements(
          element.subColorElements,
          fabricObjects
        ),
      };
    }

    const matchingObjects = fabricObjects.filter(
      (obj) => obj.get('id') === element.id
    );

    return {
      ...element,
      fabricObjects: matchingObjects,
    };
  });
}

/**
 * Populates all ColorItems in a TemplateLayerColor with their corresponding FabricObjects.
 * This works recursively for nested ColorGroups.
 *
 * @param layer - A TemplateLayerColor object containing nested ColorElements
 * @param fabricObjects - An array of FabricObjects to associate with ColorItems
 * @returns A new TemplateLayerColor with ColorItems enriched with their FabricObjects
 */
export function assignFabricObjectsToColorItemsInLayer(
  layer: TemplateLayerColor,
  fabricObjects: FabricObject[]
): TemplateLayerColor {
  const shapeObjects = fabricObjects.filter(isSvgShape);

  const updatedColorElements = assignFabricObjectsToColorElements(
    layer.colorElements,
    shapeObjects
  );

  return {
    ...layer,
    colorElements: updatedColorElements,
  };
}

/**
 * Determines whether the given FabricObject is a vector shape (not image, group, or text).
 *
 * @param obj - The FabricObject to check.
 * @returns True if the object is an SVG shape, false otherwise.
 */
export function isSvgShape(obj: FabricObject): boolean {
  const shapeTypes = [
    'path',
    'rect',
    'circle',
    'ellipse',
    'polygon',
    'polyline',
    'line',
  ];

  return shapeTypes.includes(obj.get('type'));
}

export function hideOrShowObjectsById(
  canvas: Canvas,
  ids: string[],
  hide: boolean
): void {
  canvas.getObjects().forEach((obj) => {
    const id = obj.get('id');
    if (ids.includes(id)) {
      obj.set('opacity', hide ? '0' : '100');
    }
  });

  canvas.requestRenderAll();
}

/**
 * Clone all FabricObjects from an array of ColorItems and return a flat array of clones.
 *
 * @param colorItems - Array of ColorItems with fabricObjects
 * @returns Promise resolving to an array of cloned FabricObjects
 */
export async function cloneAllObjectsFromColorItems(
  colorItems: ColorItem[]
): Promise<FabricObject[]> {
  const clonedObjectsArrays = await Promise.all(
    colorItems.map((item) =>
      Promise.all((item.fabricObjects ?? []).map((obj) => obj.clone()))
    )
  );

  // Flatten the array of arrays into a single array of cloned objects
  return clonedObjectsArrays.flat();
}

/**
 * Draws an image on a Fabric.js canvas.
 *
 * @param canvas - The Fabric canvas to draw the image on.
 * @param image - The image data conforming to the Image interface.
 * @returns A Promise that resolves with the added FabricImage.
 */
export async function drawImageOnCanvas(
  canvas: Canvas,
  image: Image
): Promise<Image> {
  const fabricImage = await FabricImage.fromURL(image.url);
  fabricImage.set({
    id: image.id,
    name: image.name,
    left: image.x,
    top: image.y,
    scaleX: image.scaleX ?? 1,
    scaleY: image.scaleY ?? 1,
    angle: image.angle,
    absolutePositioned: true,
  });

  canvas.add(fabricImage);
  canvas.bringObjectToFront(fabricImage);
  canvas.requestRenderAll();

  return { ...image, fabricImage };
}

export function makeColorItemNonInteractive(colorItem: ColorItem) {
  const objects = colorItem?.fabricObjects;
  if (!objects?.length) return;

  objects.forEach((obj) => {
    obj.set({
      evented: false,
      perPixelTargetFind: false,
      targetFindTolerance: 0,
      hoverCursor: 'default',
    });
    obj.off();
  });
}

export function makeColorItemInteractive(
  colorItem: ColorItem,
  canvas: Canvas,
  onMouseDown: (colorItemId: string) => void
) {
  const objects = colorItem?.fabricObjects;
  if (!objects?.length) return;

  objects.forEach((obj) => {
    obj.set({
      evented: true,
      perPixelTargetFind: true,
      targetFindTolerance: 0,
      hoverCursor: 'pointer',
    });

    const hoverColor = brightenHexColor(colorItem.color.value, 50);
    obj.on('mouseover', () => {
      objects.forEach((o) => {
        o.set('fill', hoverColor);
      });
      canvas.requestRenderAll();
    });

    obj.on('mouseout', () => {
      objects.forEach((o) => {
        o.set('fill', colorItem.color.value);
      });
      canvas.requestRenderAll();
    });

    obj.on('mousedown', () => {
      onMouseDown(colorItem.id);
    });
  });
}

export function makeImageNonInteractive(image: Image) {
  if (!image.fabricImage) return;

  image.fabricImage.set({
    selectable: false,
    evented: false,
  });
  image.fabricImage.off();
}

export function makeImageInteractive(
  image: Image,
  onModified: (modifiedImage: Image) => void
) {
  if (!image.fabricImage) return;

  image.fabricImage.set({
    selectable: true,
    evented: true,
  });

  image.fabricImage.on('modified', function (e) {
    if (!e.transform) return;
    const {
      transform: { target },
    } = e;

    const updatedImage = {
      ...image,
      x: target.left,
      y: target.top,
      angle: target.angle,
      scaleX: target.scaleX,
      scaleY: target.scaleY,
    };

    onModified(updatedImage);
  });
}

export async function clipImageLayerToColorLayer(
  canvas: Canvas,
  imageLayer: TemplateLayerImage,
  colorLayer: TemplateLayerColor
) {
  const clonedObjects = await cloneAllObjectsFromColorItems(
    collectColorItems(colorLayer.colorElements)
  );

  const clipGroup = new Group(clonedObjects);
  clipGroup.set({
    id: `clip-${imageLayer.config.clipWithLayerId}`,
    absolutePositioned: true,
    selectable: false,
    evented: false,
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    visible: true,
    opacity: 0,
  });

  canvas.add(clipGroup);
  canvas.sendObjectToBack(clipGroup);

  imageLayer.images.forEach((image) => {
    if (!image.fabricImage) return;

    image.fabricImage.set({
      clipPath: clipGroup,
    });
  });
}

export async function unclipImageLayer(
  canvas: Canvas,
  imageLayer: TemplateLayerImage
) {
  imageLayer.images.forEach((image) => {
    if (!image.fabricImage) return;

    image.fabricImage.set({
      clipPath: null,
    });
  });

  const clipGroup = canvas
    .getObjects()
    .find(
      (obj) => obj.get('id') === `clip-${imageLayer.config.clipWithLayerId}`
    );

  if (clipGroup) {
    canvas.remove(clipGroup);
  }

  canvas.requestRenderAll();
}
