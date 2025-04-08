/**
 * キー未選択時に表示するコンポーネント
 */
interface NoSelectionViewProps {
  onCopyAllClick: () => void;
}

export function NoSelectionView({ onCopyAllClick }: NoSelectionViewProps) {
  return (
    <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded p-4 overflow-auto bg-white dark:bg-gray-800 relative">
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          リストからキーを選択してください
        </p>
        <button 
          onClick={onCopyAllClick}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          aria-label="すべての翻訳元テキストをコピー"
        >
          すべての翻訳元テキストをコピー
        </button>
      </div>
    </div>
  );
}