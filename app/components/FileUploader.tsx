import { useCallback, useState, useRef } from 'react';

interface FileUploaderProps {
  onSourceFileSelect: (file: File) => void;
  onTargetFileSelect: (file: File) => void;
  onCreateNewTarget: () => void;
  isLoading: boolean;
  selectedTargetFileName: string | null;
  fileFormat: 'json' | 'lang';
  onFormatChange: (format: 'json' | 'lang') => void;
}

export function FileUploader({ 
  onSourceFileSelect, 
  onTargetFileSelect, 
  onCreateNewTarget,
  isLoading, 
  selectedTargetFileName,
  fileFormat,
  onFormatChange
}: FileUploaderProps) {
  const [createNew, setCreateNew] = useState(false);
  const sourceFileInputRef = useRef<HTMLInputElement>(null);
  const targetFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSourceFileName, setSelectedSourceFileName] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleCreateNew = useCallback(() => {
    setCreateNew(true);
    onCreateNewTarget();
  }, [onCreateNewTarget]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // ファイル形式変更ハンドラ
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.target.value as 'json' | 'lang';
    onFormatChange(newFormat);
  };

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-1">
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={toggleExpand}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            aria-expanded={isExpanded}
          >
            <span className="mr-1">{isExpanded ? '▼' : '▶'}</span>
            <span>ファイル設定</span>
          </button>
          {selectedSourceFileName && (
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              翻訳元: {selectedSourceFileName}
            </span>
          )}
          {selectedTargetFileName && (
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              翻訳先: {selectedTargetFileName} {createNew && '(新規作成)'}
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-2 mb-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md transition-all">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="source-file" className="font-medium">翻訳元ファイル (en_us.json または en_us.lang など):</label>
              <input 
                type="file" 
                id="source-file" 
                accept=".json,.lang"
                onChange={handleSourceFileChange} 
                disabled={isLoading}
                ref={sourceFileInputRef}
                className="border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="target-file" className="font-medium">翻訳先ファイル (ja_jp.json または ja_jp.lang など):</label>
              <div className="flex gap-2">
                <input 
                  type="file" 
                  id="target-file" 
                  accept=".json,.lang"
                  onChange={handleTargetFileChange}
                  disabled={isLoading || createNew}
                  ref={targetFileInputRef}
                  className={`flex-1 border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 ${createNew ? 'opacity-50' : ''}`}
                />
                <button
                  onClick={handleCreateNew}
                  disabled={isLoading}
                  className={`px-3 py-1 ${createNew 
                    ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                  } rounded transition-colors`}
                  title="新しい翻訳ファイルを作成します"
                >
                  新規作成
                </button>
              </div>
              {createNew && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1 space-y-2">
                  <p>新規ファイルが作成されました。翻訳が完了したら「翻訳ファイルをダウンロード」ボタンからダウンロードしてください。</p>
                  <div className="flex items-center gap-2">
                    <span>ファイル形式: </span>
                    <select 
                      value={fileFormat} 
                      onChange={handleFormatChange}
                      className="py-0.5 px-1 rounded text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      <option value="json">JSON形式 (.json)</option>
                      <option value="lang">Lang形式 (.lang)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}