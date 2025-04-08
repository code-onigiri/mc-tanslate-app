import React from 'react';

interface ListHeaderProps {
  totalKeys: number;
  filteredKeysCount: number;
  progress: number;
}

/**
 * 翻訳リストのヘッダーコンポーネント
 * 総キー数、検索結果、進捗などの統計情報を表示
 */
export function ListHeader({ totalKeys, filteredKeysCount, progress }: ListHeaderProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 py-1 px-2 text-sm flex justify-between border-b border-gray-200 dark:border-gray-700">
      <div>総キー数: {totalKeys}</div>
      <div>検索結果: {filteredKeysCount}</div>
      <div>進捗: {progress}%</div>
    </div>
  );
}