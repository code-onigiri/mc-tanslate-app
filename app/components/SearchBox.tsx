import React from 'react';
import { validateRegex } from '../util/regexUtils';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isRegexSearch: boolean;
  setIsRegexSearch: (isRegex: boolean) => void;
  regexError: string | null;
}

/**
 * 検索バーコンポーネント
 * 正規表現切り替え機能付き
 */
export function SearchBar({
  searchTerm,
  setSearchTerm,
  isRegexSearch,
  setIsRegexSearch,
  regexError
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex-1">
        <div className="flex">
          <input
            type="text"
            placeholder={`${isRegexSearch ? '正規表現で検索...' : 'キーまたは値で検索...'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-2 border ${regexError ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-600'} rounded-l bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
            aria-label="検索キーワード"
          />
          <button
            onClick={() => setIsRegexSearch(!isRegexSearch)}
            className={`p-2 ${isRegexSearch ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'} rounded-r transition-colors`}
            title={isRegexSearch ? "通常検索に切り替え" : "正規表現検索に切り替え"}
            aria-label={isRegexSearch ? "通常検索に切り替え" : "正規表現検索に切り替え"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>
        </div>
        {regexError && (
          <div className="text-xs text-red-500 dark:text-red-400 mt-1 px-1">
            {regexError}
          </div>
        )}
      </div>
    </div>
  );
}
