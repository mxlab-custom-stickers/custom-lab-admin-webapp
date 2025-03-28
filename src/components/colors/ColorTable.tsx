import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx';
import { Color } from '@/models/color.ts';

export default function ColorTable({ colors }: { colors: Color[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Couleur</TableHead>
          <TableHead className="text-right">Valeur</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {colors.map((color) => (
          <TableRow key={color.id}>
            <TableCell>{color.name}</TableCell>
            <TableCell className="text-right">{color.value}</TableCell>
            <TableCell>
              <div
                className="h-6 w-6 justify-self-center rounded"
                style={{ backgroundColor: color.value }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
