import OptionsCard from '@/components/template-editor/EditTemplateLayerColor/OptionsCard.tsx';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Label } from '@/components/ui/label';
import React from 'react';

export default function OtherOptionsCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <OptionsCard className={className} {...props}>
      <CardHeader>
        <CardTitle>Autres options</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3 *:font-normal">
          <Label>
            <Checkbox />
            Palette de couleurs
          </Label>

          <Label>
            <Checkbox disabled />
            Autoriser le focus
          </Label>
        </div>
      </CardContent>
    </OptionsCard>
  );
}
