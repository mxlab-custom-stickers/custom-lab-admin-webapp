import LoadingSpinner from '@/components/ui/LoadingSpinner.tsx';
import { Properties } from 'csstype';
import { Upload } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const wrapperStyle: Properties<string | number> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '30px',
  backgroundColor: '#f3f4f6',
  color: '#9ca3af',
  borderRadius: 23,
};

const baseStyle: Properties<string | number> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  width: '100%',
  height: '100%',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 23,
  borderColor: '#d1d5db',
  borderStyle: 'dashed',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

type DropzoneProps = {
  className?: string;
  children?: React.ReactNode;
  onDrop?: (files: File[]) => void;
  loading?: boolean;
};

export default function Dropzone({
  className,
  children,
  onDrop: onDropProp,
  loading = false,
}: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onDropProp?.(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/svg+xml': ['.svg'] },
    maxFiles: 1,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className={className} style={wrapperStyle}>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} disabled={loading} />

        {loading ? (
          <LoadingSpinner size={96} />
        ) : (
          <>
            <Upload size={64} />
            {children ? children : <p>Drag 'n' drop some files here, or click to select files</p>}
          </>
        )}
      </div>
    </div>
  );
}
