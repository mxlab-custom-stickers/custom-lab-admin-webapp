import fitty from 'fitty';
import React, { useEffect, useRef } from 'react';

type FitTextProps = React.ComponentPropsWithoutRef<'div'> & {
  minSize?: number;
  maxSize?: number;
};

export function FitText({
  children,
  className,
  minSize = 12,
  maxSize = 120,
  ...props
}: FitTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const instance = fitty(ref.current, {
        minSize,
        maxSize,
        multiLine: false, // Set to true if you want multiline fitting
      });

      return () => {
        instance.unsubscribe(); // Clean up when unmounting
      };
    }
  }, [children, minSize, maxSize]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
