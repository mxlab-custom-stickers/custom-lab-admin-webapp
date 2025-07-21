import SidebarFooter from '@/components/sidebar/SidebarFooter.tsx';
import SidebarHeader from '@/components/sidebar/SidebarHeader.tsx';
import SidebarView from '@/views/sidebar';
import { cn } from '@clab/utils';
import React from 'react';

type SidebarClassNames = {
  header?: string;
  content?: string;
  footer?: string;
};

type SidebarProps = React.ComponentPropsWithoutRef<'div'> & {
  classNames?: SidebarClassNames;
};

export default function Sidebar({ className, classNames, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        'w-68 fixed bottom-4 left-4 top-4 z-30 flex flex-col justify-between rounded-xl bg-[#323232] text-white shadow-xl',
        className
      )}
      {...props}
    >
      {/* Header */}
      <SidebarHeader className={cn('border-b border-gray-600 p-3', classNames?.header)} />

      {/*/!* Content*!/*/}
      {/*<ScrollArea className={cn('flex-1 overflow-auto', classNames?.content)}>*/}
      {/*  {sidebarView ? (*/}
      {/*    <div>{sidebarViewComponents[sidebarView.type]}</div>*/}
      {/*  ) : currentLayer ? (*/}
      {/*    <div>*/}
      {/*      /!* Show the layer header only if no color element is selected (color layer only) *!/*/}
      {/*      {!selectedColorElement ? (*/}
      {/*        <div className="px-3 py-2">*/}
      {/*          <div className="text-2xl font-semibold uppercase">{currentLayer.name}</div>*/}
      {/*          <div>*/}
      {/*            {currentLayer.message ||*/}
      {/*              'Un message porub  hyfg ezuygf ezuyfguyezf uyieuyfgzeyu fuyz'}*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      ) : null}*/}
      {/*      /!* Show the component corresponding to the current layer type *!/*/}
      {/*      {currentLayerComponents[currentLayer.type]}*/}
      {/*    </div>*/}
      {/*  ) : null}*/}
      {/*</ScrollArea>*/}

      {/* View */}
      <SidebarView className={cn('flex-1 overflow-auto p-2 pr-3 text-lg', classNames?.content)} />

      {/* Footer */}
      <SidebarFooter className={cn('border-t border-gray-600 p-2', classNames?.footer)} />
    </div>
  );
}
