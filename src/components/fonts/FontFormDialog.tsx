import FontForm from '@/components/fonts/FontForm.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Plus } from 'lucide-react';

export default function FontFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nouvelle police
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-2xl gap-6">
        <DialogHeader>
          <DialogTitle>Nouvelle police</DialogTitle>
          <DialogDescription>
            Crée une nouvelle police personnalisée pour les textes
          </DialogDescription>
        </DialogHeader>

        <FontForm id="font-form" />

        <DialogFooter>
          <Button type="submit" form="font-form">
            Créer la police
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
