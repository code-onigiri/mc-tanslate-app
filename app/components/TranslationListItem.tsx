import React from 'react';
import { highlightText, highlightRegexMatches } from '../util/highlight';
import { hasContent } from '../util/stringUtils';

interface TranslationListItemProps {
  itemKey: string;
  sourceValue: string;
  targetValue?: string;
  isSelected: boolean;
  searchTerm: string;
  isRegexSearch: boolean;
  onSelectKey: (key: string) => void;
  style?: React.CSSProperties; // react-windowから渡されるスタイル
}

/**
 * 翻訳リストの各アイテムを表示するコンポーネント
 */
export function TranslationListItem({
  itemKey,
  sourceValue,
  targetValue,
  isSelected,
  searchTerm,
  isRegexSearch,
  onSelectKey,
  style
}: TranslationListItemProps) {
  const isTranslated = !!targetValue;

  return (
    <div 
      style={style}
      className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700' // 通常の選択項目
          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
      } ${
        isTranslated 
          ? 'border-l-4 border-green-500' 
          : 'border-l-4 border-red-500'
      }`}
      onClick={() => onSelectKey(itemKey)}
    >
      {/* キー名 */}
      <div className="font-medium text-sm text-gray-600 dark:text-gray-300 truncate max-w-full" title={itemKey}>
        {hasContent(searchTerm) 
          ? (isRegexSearch ? highlightRegexMatches(itemKey, searchTerm) : highlightText(itemKey, searchTerm)) 
          : itemKey}
      </div>
      
      {/* 元の値と翻訳 */}
      <div className="grid grid-cols-1 gap-1 mt-1 w-full overflow-hidden">
        {/* 元の値 */}
        <div className="text-sm w-full">
          <span className="font-medium text-gray-700 dark:text-gray-300">元の値: </span>
          <span className="text-gray-600 dark:text-gray-400 inline-block truncate max-w-[85%] align-bottom" 
                title={sourceValue}>
            {hasContent(searchTerm) 
              ? (isRegexSearch ? highlightRegexMatches(sourceValue, searchTerm) : highlightText(sourceValue, searchTerm))
              : sourceValue}
          </span>
        </div>
        
        {/* 翻訳値 */}
        <div className="text-sm w-full">
          <span className="font-medium text-gray-700 dark:text-gray-300">翻訳: </span>
          {isTranslated ? (
            <span className="text-green-600 dark:text-green-400 inline-block truncate max-w-[85%] align-bottom"
                  title={targetValue}>
              {hasContent(searchTerm) 
                ? (isRegexSearch ? highlightRegexMatches(targetValue!, searchTerm) : highlightText(targetValue!, searchTerm))
                : targetValue}
            </span>
          ) : (
            <span className="text-red-500 dark:text-red-400 italic">未翻訳</span>
          )}
        </div>
      </div>
    </div>
  );
}