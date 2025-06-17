import OptionsCard from '@/components/template-editor/OptionsCard.tsx';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Switch } from '@/components/ui/switch.tsx';

export default function OtherOptionsCard() {
  return (
    <OptionsCard>
      <CardHeader>
        <CardTitle>Autres options</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3 *:font-normal">
          <Label>
            <Switch />
            Autoriser le strech
          </Label>
        </div>
      </CardContent>
    </OptionsCard>
  );
}
