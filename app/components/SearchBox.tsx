import React, { useState, useEffect } from 'react';
import { validateRegex } from '../util/regexUtils';

interface SearchBoxProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isRegexSearch: boolean;
  setIsRegexSearch: (isRegex: boolean) => void;
  onToggleReplace: () => void;
  showReplaceInput: boolean;
}

export function SearchBox({
  searchTerm,
  setSearchTerm,
  isRegexSearch,
  setIsRegexSearch,
  onToggleReplace,
  showReplaceInput
}: SearchBoxProps) {
  const [regexError, setRegexError] = useState<string | null>(null);

  // 正規表現の検証
  useEffect(() => {
    if (isRegexSearch && searchTerm) {
      const error = validateRegex(searchTerm);
      setRegexError(error);
    } else {
      setRegexError(null);
    }
  }, [searchTerm, isRegexSearch]);

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
          />
          <button
            onClick={() => setIsRegexSearch(!isRegexSearch)}
            className={`p-2 ${isRegexSearch ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'} rounded-r`}
            title={isRegexSearch ? "通常検索に切り替え" : "正規表現検索に切り替え"}
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
      <button
        onClick={onToggleReplace}
        className={`p-2 rounded ${showReplaceInput ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        title="文字置換"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}
