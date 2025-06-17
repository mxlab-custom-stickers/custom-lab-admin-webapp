import OptionsCard from '@/components/template-editor/OptionsCard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';

export default function ImagesOptionsCard() {
  return (
    <OptionsCard>
      <CardHeader>
        <CardTitle>Images</CardTitle>
      </CardHeader>

      <CardContent>
        <Button className="w-full" variant="outline" disabled>
          Configurer les images
        </Button>
      </CardContent>
    </OptionsCard>
  );
}
