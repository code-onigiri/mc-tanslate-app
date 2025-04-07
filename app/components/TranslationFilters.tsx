import { useState } from 'react';
import type { FilterType } from '../edit_page/edit';

// ソート順を表す型定義
export type SortOrder = 'none' | 'keyAsc' | 'keyDesc' | 'sourceAsc' | 'sourceDesc' | 'targetAsc' | 'targetDesc';

interface TranslationFiltersProps {
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export function TranslationFilters({ filterType, onFilterChange, sortOrder, onSortChange }: TranslationFiltersProps) {
  // ソートメニューの表示/非表示を制御する状態
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // ソート順の表示名のマッピング
  const sortLabels: Record<SortOrder, string> = {
    'none': 'デフォルト',
    'keyAsc': 'キー A→Z',
    'keyDesc': 'キー Z→A',
    'sourceAsc': '原文 A→Z',
    'sourceDesc': '原文 Z→A',
    'targetAsc': '翻訳文 A→Z',
    'targetDesc': '翻訳文 Z→A'
  };

  return (
    <div className="flex flex-col border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button
          className={`py-2 px-4 font-medium ${filterType === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => onFilterChange('all')}
        >
          すべて
        </button>
        <button
          className={`py-2 px-4 font-medium ${filterType === 'translated' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => onFilterChange('translated')}
        >
          翻訳済み
        </button>
        <button
          className={`py-2 px-4 font-medium ${filterType === 'untranslated' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => onFilterChange('untranslated')}
        >
          未翻訳
        </button>

        {/* ソートボタン - 右側に配置 */}
        <div className="ml-auto relative">
          <button
            className="flex items-center py-2 px-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span>{sortLabels[sortOrder]}</span>
          </button>
          
          {/* ソートドロップダウンメニュー */}
          {showSortMenu && (
            <div className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {(Object.keys(sortLabels) as SortOrder[]).map((order) => (
                  <button
                    key={order}
                    className={`block w-full text-left px-4 py-2 text-sm ${sortOrder === order ? 'bg-gray-100 dark:bg-gray-700 text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={() => {
                      onSortChange(order);
                      setShowSortMenu(false);
                    }}
                  >
                    {sortLabels[order]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}