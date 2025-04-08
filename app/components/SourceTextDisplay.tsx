import { highlightText, highlightRegexMatches } from '../util/highlight';
import { hasContent } from '../util/stringUtils';

interface SourceTextDisplayProps {
  text: string;
  searchTerm?: string;
  isRegexSearch?: boolean;
}

/**
 * 原文を表示するコンポーネント
 * 検索語句がある場合はハイライト表示する
 */
export function SourceTextDisplay({ text, searchTerm = '', isRegexSearch = false }: SourceTextDisplayProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded min-h-[5rem] whitespace-pre-wrap">
      {hasContent(searchTerm) 
        ? (isRegexSearch 
          ? highlightRegexMatches(text, searchTerm) 
          : highlightText(text, searchTerm))
        : text}
    </div>
  );
}