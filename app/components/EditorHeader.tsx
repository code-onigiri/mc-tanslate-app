import { hasContent } from '../util/stringUtils';
import { highlightText, highlightRegexMatches } from '../util/highlight';

/**
 * エディタヘッダーコンポーネント
 * 選択中のキー名と操作ボタンを表示する
 */
interface EditorHeaderProps {
  selectedKey: string;
  searchTerm?: string;
  isRegexSearch?: boolean;
  onCopyCurrentClick: () => void;
  onCopyAllClick: () => void;
}

export function EditorHeader({ 
  selectedKey, 
  searchTerm = '', 
  isRegexSearch = false, 
  onCopyCurrentClick,
  onCopyAllClick
}: EditorHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold flex items-center flex-wrap">
        <span>選択中のキー:</span>
        <span className="ml-1 mr-2">
          {hasContent(searchTerm) 
            ? (isRegexSearch ? highlightRegexMatches(selectedKey, searchTerm) : highlightText(selectedKey, searchTerm))
            : selectedKey}
        </span>
      </h3>
      
      <div className="flex gap-2">
        <button 
          onClick={onCopyCurrentClick}
          className="text-sm bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
          title="このキーの翻訳元テキストを翻訳先にコピーします"
          aria-label="原文からコピー"
        >
          原文からコピー
        </button>
        <button 
          onClick={onCopyAllClick}
          className="text-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
          title="すべての翻訳元テキストを翻訳先にコピーします"
          aria-label="原文からすべてをコピー"
        >
          原文からすべてをコピー
        </button>
      </div>
    </div>
  );
}