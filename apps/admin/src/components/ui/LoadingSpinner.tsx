import { LoaderCircle, LucideProps } from 'lucide-react';

export default function LoadingSpinner(props: LucideProps) {
  return <LoaderCircle className="animate-spin" size={props.size || 64} {...props} />;
}
