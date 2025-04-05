import type { LanguageData } from '../util/load/jsontodata';

interface TranslationListItemProps {
  style: React.CSSProperties;
  sourceData: LanguageData;
  targetData: LanguageData;
  translationKey: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function TranslationListItem({
  style,
  sourceData,
  targetData,
  translationKey,
  isSelected,
  onSelect
}: TranslationListItemProps) {
  const isTranslated = translationKey in targetData;

  return (
    <div 
      style={style}
      key={translationKey} 
      className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
      } ${
        isTranslated 
          ? 'border-l-4 border-green-500' 
          : 'border-l-4 border-red-500'
      }`}
      onClick={onSelect}
    >
      {/* 改良されたリスト表示: key, 元のvalue, 翻訳後のvalue */}
      <div className="font-medium text-sm text-gray-600 dark:text-gray-300 truncate max-w-full" title={translationKey}>
        {translationKey}
      </div>
      <div className="grid grid-cols-1 gap-1 mt-1 w-full overflow-hidden">
        <div className="text-sm w-full">
          <span className="font-medium text-gray-700 dark:text-gray-300">元の値: </span>
          <span className="text-gray-600 dark:text-gray-400 inline-block truncate max-w-[85%] align-bottom" 
                title={sourceData?.[translationKey]}>
            {sourceData?.[translationKey]}
          </span>
        </div>
        <div className="text-sm w-full">
          <span className="font-medium text-gray-700 dark:text-gray-300">翻訳: </span>
          {isTranslated ? (
            <span className="text-green-600 dark:text-green-400 inline-block truncate max-w-[85%] align-bottom"
                  title={targetData[translationKey]}>
              {targetData[translationKey]}
            </span>
          ) : (
            <span className="text-red-500 dark:text-red-400 italic">未翻訳</span>
          )}
        </div>
      </div>
    </div>
  );
}