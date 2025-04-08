import { useState, useRef, useCallback } from 'react';

/**
 * ファイル選択とフォーマット処理のためのカスタムフック
 * @param onFileSelect ファイル選択時のコールバック
 * @param onFormatChange ファイル形式変更時のコールバック
 * @returns ファイル選択関連の状態と操作
 */
export function useFileSelection(
  onFileSelect: (file: File) => void, 
  onFormatChange?: (format: 'json' | 'lang') => void
) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setSelectedFileName(file.name);
    
    // ファイル拡張子からフォーマットを自動設定
    if (onFormatChange) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'lang') {
        onFormatChange('lang');
      } else {
        onFormatChange('json');
      }
    }
    
    onFileSelect(file);
    
    // ファイル選択後にファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect, onFormatChange]);

  const resetFileSelection = () => {
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    selectedFileName,
    setSelectedFileName,
    fileInputRef,
    handleFileChange,
    resetFileSelection
  };
}
