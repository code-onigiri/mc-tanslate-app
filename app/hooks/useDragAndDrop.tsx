import { useState, useRef } from 'react';

/**
 * ドラッグ＆ドロップの状態と操作を管理するカスタムフック
 * @returns ドラッグ＆ドロップの状態とイベントハンドラ
 */
export function useDragAndDrop() {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounterRef = useRef<number>(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, callback: (file: File) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    dragCounterRef.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      callback(file);
    }
  };

  return {
    isDraggingOver,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop
  };
}
