import React from 'react';

export function TopControlsBox({
  x,
  y,
  visible,
  children,
}: {
  x: number;
  y: number;
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translate(-50%, -100%)',
        display: visible ? 'block' : 'none',
        background: '#fff',
        border: '1px solid #ccc',
        padding: '4px 8px',
        borderRadius: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}
