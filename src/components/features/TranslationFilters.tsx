import type { FilterType } from '../edit_page/edit';

interface TranslationFiltersProps {
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
}

export function TranslationFilters({ filterType, onFilterChange }: TranslationFiltersProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
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
    </div>
  );
}