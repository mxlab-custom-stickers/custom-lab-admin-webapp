import { Button } from '@/components/ui/button.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput';
import { Label } from '@/components/ui/label.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-context.ts';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.ts';
import ColorSelector from '../colors/ColorSelector';

export default function EditTemplateLayerColorComponent() {
  const { allColorPalettes, allColors } = useTemplateEditorContext();
  const { currentLayer } = useConfiguratorContext();

  return (
    <div className="flex flex-col gap-3 pt-1 [&_input]:bg-white [&_label]:mb-2">
      <InvisibleInput
        className="!text-lg font-semibold"
        value={currentLayer?.name}
      />

      <div>
        <Label>Calque</Label>
        <Button className="w-full" variant="outline">
          Modifier le calque
        </Button>
      </div>

      <div>
        <Label>Couleurs</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full" variant="outline">
              Sélectionner les couleurs
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            sideOffset={18}
            className="w-full"
          >
            <ColorSelector
              allColorPalettes={allColorPalettes}
              allColors={allColors}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  // function handleSvgLayerSelect(svgLayer: SvgLayer) {
  //   setShowLayerPicker(false);
  //
  //   const newValue: TemplateLayerColor = {
  //     type: 'color',
  //     id: svgLayer.id,
  //     name: svgLayer.id,
  //     order: layer?.order || template.layers.length + 1,
  //     colorElements: svgLayerToColorElements(svgLayer),
  //     config: {
  //       availableColors: [...(layer?.config.availableColors || [])],
  //       availableColorPalettes: [
  //         ...(layer?.config.availableColorPalettes || []),
  //       ],
  //     },
  //   };
  //
  //   setLayer(newValue);
  //
  //   const existingLayerIndex = template.layers.findIndex(
  //     (layer) => layer.order === newValue.order
  //   );
  //   if (existingLayerIndex !== -1) {
  //     template.layers[existingLayerIndex] = newValue;
  //   } else {
  //     template.layers.push(newValue);
  //   }
  //   setTemplate({ ...template });
  //
  //   setCurrentTemplateLayerId(svgLayer.id);
  // }
  //
  // return svgInjecting ? (
  //   <>Chargement...</>
  // ) : !layer || showLayerPicker ? (
  //   <>
  //     {layer ? (
  //       <Button
  //         className="mb-2"
  //         size="icon"
  //         variant="outline"
  //         onClick={() => setShowLayerPicker(false)}
  //       >
  //         <ChevronLeft />
  //       </Button>
  //     ) : null}
  //
  //     <SvgLayerPicker
  //       svgId={template.id}
  //       onLayerSelect={handleSvgLayerSelect}
  //     />
  //   </>
  // ) : (
  //   <div className="flex flex-col gap-3 pt-1 [&_input]:bg-white [&_label]:mb-2">
  //     <InvisibleInput className="!text-lg font-semibold" value={layer.name} />
  //
  //     <div>
  //       <Label>Couleurs</Label>
  //
  //       <Popover>
  //         <PopoverTrigger asChild>
  //           <Button className="w-full" variant="outline">
  //             Sélectionner les couleurs
  //           </Button>
  //         </PopoverTrigger>
  //         <PopoverContent
  //           side="left"
  //           align="start"
  //           sideOffset={18}
  //           className="w-full"
  //         >
  //           <ColorSelector
  //             allColors={allColors || []}
  //             allColorPalettes={allColorPalettes || []}
  //           />
  //         </PopoverContent>
  //       </Popover>
  //     </div>
  //   </div>
  // );
}
