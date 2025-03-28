import svg from '@/assets/KTM_2024_lab1.svg';
import * as React from 'react';
import { useMemo } from 'react';
import { ReactSVG, Props as ReactSVGProps } from 'react-svg';

type SvgProps = { afterInjection?: (svg: SVGSVGElement) => void };

// Memoized the SVG so it doesn't re-render on every state change
const ReactSVGMemo = React.memo(ReactSVG);

export function Svg({ afterInjection }: SvgProps) {
  const memoValue: Omit<ReactSVGProps, 'ref'> = useMemo(
    () => ({
      src: svg,
      beforeInjection: (svg) => {
        svg.setAttribute('id', 'nouveau-template');
      },
      afterInjection,
    }),
    []
  );

  return <ReactSVGMemo {...memoValue} />;
}
