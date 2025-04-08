import React from 'react';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

interface FileDropZoneProps {
  id: string;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  acceptTypes?: string;
  className?: string;
  label?: string;
  sublabel?: string;
}

/**
 * ファイルドロップ機能付きのファイル選択ゾーンコンポーネント
 */
export function FileDropZone({
  id,
  onFileSelect,
  disabled = false,
  fileInputRef,
  onChange,
  isLoading = false,
  acceptTypes = ".json,.lang",
  className = "",
  label = "クリックまたはドラッグ&ドロップ",
  sublabel = "(.json または .lang)"
}: FileDropZoneProps) {
  const { 
    isDraggingOver, 
    handleDragEnter, 
    handleDragLeave, 
    handleDragOver, 
    handleDrop 
  } = useDragAndDrop();

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        disabled 
          ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700'
          : (isDraggingOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500')
      } ${className}`}
      onDragEnter={!disabled ? handleDragEnter : undefined}
      onDragLeave={!disabled ? handleDragLeave : undefined}
      onDragOver={!disabled ? handleDragOver : undefined}
      onDrop={!disabled ? (e) => handleDrop(e, onFileSelect) : undefined}
    >
      <input 
        type="file" 
        id={id} 
        accept={acceptTypes}
        onChange={onChange}
        disabled={isLoading || disabled}
        ref={fileInputRef}
        className="hidden"
      />
      <label 
        htmlFor={!disabled ? id : undefined} 
        className={`flex flex-col items-center justify-center py-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 dark:text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
        <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">{sublabel}</span>
      </label>
    </div>
  );
}
