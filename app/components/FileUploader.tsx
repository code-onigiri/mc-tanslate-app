import { useCallback, useState, useRef } from 'react';

interface FileUploaderProps {
  onSourceFileSelect: (file: File) => void;
  onTargetFileSelect: (file: File) => void;
  onCreateNewTarget: () => void;
  isLoading: boolean;
  selectedTargetFileName: string | null;
  fileFormat: 'json' | 'lang';
  onFormatChange: (format: 'json' | 'lang') => void;
  triggerClickAnimation: (id: string, callback?: () => void) => void;
}

export function FileUploader({ 
  onSourceFileSelect, 
  onTargetFileSelect, 
  onCreateNewTarget,
  isLoading, 
  selectedTargetFileName,
  fileFormat,
  onFormatChange,
  triggerClickAnimation
}: FileUploaderProps) {
  const [createNew, setCreateNew] = useState(false);
  const sourceFileInputRef = useRef<HTMLInputElement>(null);
  const targetFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSourceFileName, setSelectedSourceFileName] = useState<string | null>(null);

  // ドラッグ&ドロップ関連の状態
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounterRef = useRef<number>(0);

  const handleSourceFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setSelectedSourceFileName(file.name);
    
    // ファイル拡張子からフォーマットを自動設定
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'lang') {
      onFormatChange('lang');
    } else {
      onFormatChange('json');
    }
    
    onSourceFileSelect(file);
    // ファイル選択後にファイル入力をリセット
    if (sourceFileInputRef.current) {
      sourceFileInputRef.current.value = '';
    }
  }, [onSourceFileSelect, onFormatChange]);

  const handleTargetFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    onTargetFileSelect(file);
    setCreateNew(false); // ファイルを選択したら新規作成モードをオフに
    
    // ファイル拡張子からフォーマットを自動設定
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'lang') {
      onFormatChange('lang');
    } else {
      onFormatChange('json');
    }
    
    // ファイル選択後にファイル入力をリセット
    if (targetFileInputRef.current) {
      targetFileInputRef.current.value = '';
    }
  }, [onTargetFileSelect, onFormatChange]);

  // 新規作成ボタンのクリックアニメーション
  const handleCreateNewClick = () => {
    triggerClickAnimation('create-new-button', () => {
      setCreateNew(true);
      onCreateNewTarget();
    });
  };

  // ファイル形式変更ハンドラ
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.target.value as 'json' | 'lang';
    onFormatChange(newFormat);
  };

  // ドラッグ&ドロップイベントハンドラ
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

  const handleDrop = (e: React.DragEvent, isSource: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    dragCounterRef.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isSource) {
        setSelectedSourceFileName(file.name);
        onSourceFileSelect(file);
      } else {
        onTargetFileSelect(file);
        setCreateNew(false);
      }
    }
  };

  return (
    <div className="mb-2">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-1">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="source-file" className="font-medium text-gray-700 dark:text-gray-300">
                翻訳元ファイル
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(en_us.json/.lang)</span>
              </label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  isDraggingOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'
                } hover:border-blue-400 dark:hover:border-blue-500`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, true)}
              >
                <input 
                  type="file" 
                  id="source-file" 
                  accept=".json,.lang"
                  onChange={handleSourceFileChange} 
                  disabled={isLoading}
                  ref={sourceFileInputRef}
                  className="hidden"
                />
                <label 
                  htmlFor="source-file" 
                  className="cursor-pointer flex flex-col items-center justify-center py-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 dark:text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">クリックまたはドラッグ&ドロップ</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">(.json または .lang)</span>
                </label>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="target-file" className="font-medium text-gray-700 dark:text-gray-300">
                  翻訳先ファイル
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(ja_jp.json/.lang)</span>
                </label>
                <button
                  id="create-new-button"
                  onClick={handleCreateNewClick}
                  disabled={isLoading}
                  className={`px-3 py-1 text-sm rounded-full transition-colors duration-300 ${createNew 
                    ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
                  title="新しい翻訳ファイルを作成します"
                >
                  新規作成
                </button>
              </div>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  createNew 
                    ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700'
                    : (isDraggingOver 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500')
                }`}
                onDragEnter={!createNew ? handleDragEnter : undefined}
                onDragLeave={!createNew ? handleDragLeave : undefined}
                onDragOver={!createNew ? handleDragOver : undefined}
                onDrop={!createNew ? (e) => handleDrop(e, false) : undefined}
              >
                <input 
                  type="file" 
                  id="target-file" 
                  accept=".json,.lang"
                  onChange={handleTargetFileChange}
                  disabled={isLoading || createNew}
                  ref={targetFileInputRef}
                  className="hidden"
                />
                <label 
                  htmlFor={!createNew ? "target-file" : undefined} 
                  className={`flex flex-col items-center justify-center py-2 ${createNew ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 dark:text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">クリックまたはドラッグ&ドロップ</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">(.json または .lang)</span>
                </label>
              </div>
              {createNew && (
                <div className="flex items-center gap-3 mt-0 text-sm text-green-600 dark:text-green-400 animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>ファイル形式:</span>
                      <select 
                        value={fileFormat} 
                        onChange={handleFormatChange}
                        className="py-0.5 px-2 rounded text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 transition-colors duration-300"
                      >
                        <option value="json">JSON形式 (.json)</option>
                        <option value="lang">Lang形式 (.lang)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ml-auto flex flex-nowrap gap-2 items-center text-sm text-gray-600 dark:text-gray-400 overflow-hidden">
          {selectedSourceFileName && (
            <span className="whitespace-nowrap animate-fade-in">
              翻訳元: <span className="font-medium">{selectedSourceFileName}</span>
            </span>
          )}
          {selectedTargetFileName && (
            <span className="whitespace-nowrap animate-fade-in">
              翻訳先: <span className="font-medium">{selectedTargetFileName} {createNew && '(新規作成)'}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}