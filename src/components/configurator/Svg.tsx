import { useConfiguratorContext } from '@/contexts/configurator-context.ts';
import { cn } from '@/lib/utils.ts';
import * as React from 'react';
import { useMemo } from 'react';
import { ReactSVG, Props as ReactSVGProps } from 'react-svg';

// Memoized the SVG so it doesn't re-render on every state change
const ReactSVGMemo = React.memo(ReactSVG);

type SvgProps = {
  wrapperClassName?: string;
};

export default function Svg({ wrapperClassName }: SvgProps) {
  const { template, setSvgInjecting } = useConfiguratorContext();

  const memoValue: Omit<ReactSVGProps, 'ref'> = useMemo(
    () => ({
      src: new URL(template.svgUrl, import.meta.url).href,
      beforeInjection: (svg) => {
        setSvgInjecting(true);

        svg.setAttribute('id', template.id);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
      },
      afterInjection: () => {
        setSvgInjecting(false);
      },
    }),
    []
  );

  return (
    <div className={cn(wrapperClassName)}>
      <ReactSVGMemo {...memoValue} />
    </div>
  );
}
