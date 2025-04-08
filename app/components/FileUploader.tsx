import { useState } from 'react';
import { useFileSelection } from '../hooks/useFileSelection';
import { FileDropZone } from './FileDropZone';

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
  
  // カスタムフックを使用してファイル選択操作を管理
  const sourceFileSelection = useFileSelection(
    (file) => {
      onSourceFileSelect(file);
    }, 
    onFormatChange
  );
  
  const targetFileSelection = useFileSelection(
    (file) => {
      onTargetFileSelect(file);
      setCreateNew(false);
    }, 
    onFormatChange
  );

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
              <FileDropZone 
                id="source-file"
                onFileSelect={onSourceFileSelect}
                fileInputRef={sourceFileSelection.fileInputRef}
                onChange={sourceFileSelection.handleFileChange}
                isLoading={isLoading}
              />
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
              <FileDropZone 
                id="target-file"
                onFileSelect={onTargetFileSelect}
                fileInputRef={targetFileSelection.fileInputRef}
                onChange={targetFileSelection.handleFileChange}
                isLoading={isLoading}
                disabled={createNew}
              />
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
          {sourceFileSelection.selectedFileName && (
            <span className="whitespace-nowrap animate-fade-in">
              翻訳元: <span className="font-medium">{sourceFileSelection.selectedFileName}</span>
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