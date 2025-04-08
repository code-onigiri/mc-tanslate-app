import React from 'react';

interface ListFooterProps {
  fileFormat: 'json' | 'lang';
  onFormatChange: (format: 'json' | 'lang') => void;
  onDownload: () => void;
}

/**
 * 翻訳リストのフッターコンポーネント
 * ファイル形式選択とダウンロードボタンを提供
 */
export function ListFooter({ fileFormat, onFormatChange, onDownload }: ListFooterProps) {
  return (
    <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm">ファイル形式:</span>
        <select 
          value={fileFormat}
          onChange={(e) => onFormatChange(e.target.value as 'json' | 'lang')}
          className="py-1 px-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
          aria-label="ファイル形式の選択"
        >
          <option value="json">JSON形式 (.json)</option>
          <option value="lang">Lang形式 (.lang)</option>
        </select>
      </div>
      
      <button 
        onClick={onDownload}
        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        aria-label="翻訳ファイルをダウンロード"
      >
        翻訳ファイルをダウンロード
      </button>
    </div>
  );
}