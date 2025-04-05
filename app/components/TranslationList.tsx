import { useRef, useEffect, useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { FilterType } from '../edit_page/edit';
import type { LanguageData } from '../util/load/fileloader';
import { highlightText, highlightRegexMatches } from '../util/highlight';
import { hasContent } from '../util/stringUtils';

interface TranslationListProps {
  sourceData: LanguageData;
  targetData: LanguageData;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
  filteredKeys: string[];
  selectedKey: string | null;
  onSelectKey: (key: string) => void;
  onDownload: () => void;
  progress: number;
  onReplaceAll: (searchText: string, replaceText: string) => void;
  onReplaceWithConfirmation: (searchText: string, replaceText: string) => void;
  isReplaceMode?: boolean; // 置換モード状態
  fileFormat: 'json' | 'lang';
  onFormatChange: (format: 'json' | 'lang') => void;
  isRegexSearch: boolean;
  setIsRegexSearch: (isRegex: boolean) => void;
}

export function TranslationList({
  sourceData,
  targetData,
  searchTerm,
  setSearchTerm,
  filterType,
  onFilterChange,
  filteredKeys,
  selectedKey,
  onSelectKey,
  onDownload,
  progress,
  onReplaceAll,
  onReplaceWithConfirmation,
  isReplaceMode = false,
  fileFormat,
  onFormatChange,
  isRegexSearch,
  setIsRegexSearch
}: TranslationListProps) {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const [listHeight, setListHeight] = useState(500);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  
  // 置換機能のための状態
  const [showReplaceInput, setShowReplaceInput] = useState(false);
  const [replaceText, setReplaceText] = useState('');
  const [showReplaceConfirmation, setShowReplaceConfirmation] = useState(false);
  const [regexError, setRegexError] = useState<string | null>(null);

  // コンテナサイズの測定と更新
  useEffect(() => {
    const measureContainer = () => {
      if (listContainerRef.current) {
        const rect = listContainerRef.current.getBoundingClientRect();
        setContainerRect(rect);
        setListHeight(rect.height || 500);
      }
    };

    // 初期測定
    measureContainer();
    
    // ResizeObserverを使用して要素サイズの変更を監視
    const resizeObserver = new ResizeObserver(() => {
      measureContainer();
    });
    
    if (listContainerRef.current) {
      resizeObserver.observe(listContainerRef.current);
    }
    
    // ウィンドウサイズ変更時にも再測定
    window.addEventListener('resize', measureContainer);
    
    // コンポーネントがマウントされた後も測定
    const timer1 = setTimeout(measureContainer, 100);
    const timer2 = setTimeout(measureContainer, 500);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureContainer);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // 選択されたキーが変更されたときにリストをスクロールする
  useEffect(() => {
    if (selectedKey && listRef.current) {
      const selectedIndex = filteredKeys.findIndex(key => key === selectedKey);
      if (selectedIndex !== -1) {
        listRef.current.scrollToItem(selectedIndex, 'smart');
      }
    }
  }, [selectedKey, filteredKeys]);

  // 正規表現の検証
  useEffect(() => {
    if (isRegexSearch && searchTerm) {
      try {
        new RegExp(searchTerm);
        setRegexError(null);
      } catch (error) {
        setRegexError(`正規表現エラー: ${(error as Error).message}`);
      }
    } else {
      setRegexError(null);
    }
  }, [searchTerm, isRegexSearch]);

  // リストの表示アイテム数を動的に計算
  const itemCount = useMemo(() => filteredKeys.length, [filteredKeys.length]);
  const itemHeight = 100; // 各アイテムの高さ

  // 置換機能の処理
  const toggleReplaceInput = () => {
    setShowReplaceInput(!showReplaceInput);
    if (!showReplaceInput) {
      setReplaceText('');
    }
  };

  const handleReplaceAll = () => {
    if (!searchTerm || !replaceText || !!regexError) return;
    setShowReplaceConfirmation(true);
  };

  const confirmReplaceAll = () => {
    if (!searchTerm || !replaceText || !!regexError) return;
    onReplaceAll(searchTerm, replaceText);
    setShowReplaceConfirmation(false);
  };

  const cancelReplaceAll = () => {
    setShowReplaceConfirmation(false);
  };

  const handleReplaceWithConfirmation = () => {
    if (!searchTerm || !replaceText || !!regexError) return;
    onReplaceWithConfirmation(searchTerm, replaceText);
    setShowReplaceInput(false); // 置換モード開始後は入力エリアを閉じる
  };

  // リストアイテムのレンダリング関数
  const renderListItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const key = filteredKeys[index];
    const isTranslated = key in targetData;
    const isSelected = key === selectedKey;
    const isReplaceSelected = isReplaceMode && isSelected;

    return (
      <div 
        style={style}
        key={key} 
        className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
          isSelected 
            ? isReplaceSelected
              ? 'bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-800/60' // 置換モード中の選択項目
              : 'bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700' // 通常の選択項目
            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
        } ${
          isTranslated 
            ? 'border-l-4 border-green-500' 
            : 'border-l-4 border-red-500'
        } ${
          isReplaceSelected ? 'shadow-md' : '' // 置換モード中の選択項目に影を追加
        }`}
        onClick={() => onSelectKey(key)}
      >
        {/* リスト表示: key, 元のvalue, 翻訳後のvalue */}
        <div className="font-medium text-sm text-gray-600 dark:text-gray-300 truncate max-w-full" title={key}>
          {hasContent(searchTerm) 
            ? (isRegexSearch ? highlightRegexMatches(key, searchTerm) : highlightText(key, searchTerm)) 
            : key}
        </div>
        <div className="grid grid-cols-1 gap-1 mt-1 w-full overflow-hidden">
          <div className="text-sm w-full">
            <span className="font-medium text-gray-700 dark:text-gray-300">元の値: </span>
            <span className="text-gray-600 dark:text-gray-400 inline-block truncate max-w-[85%] align-bottom" 
                  title={sourceData[key]}>
              {hasContent(searchTerm) 
                ? (isRegexSearch ? highlightRegexMatches(sourceData[key], searchTerm) : highlightText(sourceData[key], searchTerm))
                : sourceData[key]}
            </span>
          </div>
          <div className="text-sm w-full">
            <span className="font-medium text-gray-700 dark:text-gray-300">翻訳: </span>
            {isTranslated ? (
              <span className="text-green-600 dark:text-green-400 inline-block truncate max-w-[85%] align-bottom"
                    title={targetData[key]}>
                {hasContent(searchTerm) 
                  ? (isRegexSearch ? highlightRegexMatches(targetData[key], searchTerm) : highlightText(targetData[key], searchTerm))
                  : targetData[key]}
              </span>
            ) : (
              <span className="text-red-500 dark:text-red-400 italic">未翻訳</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-2/5 flex flex-col border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 h-full relative">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
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
            onClick={toggleReplaceInput}
            className={`p-2 rounded ${showReplaceInput ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            title="文字置換"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        {/* 置換UI - 検索欄の下に配置 */}
        {showReplaceInput && (
          <div className="mb-4 space-y-3 bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="置換後の文字..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="flex-1 p-2 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleReplaceWithConfirmation}
                className="text-sm bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!searchTerm || !replaceText || !!regexError}
              >
                確認しながら置換
              </button>
              <button
                onClick={handleReplaceAll}
                className="text-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!searchTerm || !replaceText || !!regexError}
              >
                一括置換
              </button>
            </div>
          </div>
        )}
        
        {/* フィルタータブ */}
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
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 py-1 px-2 text-sm flex justify-between border-b border-gray-200 dark:border-gray-700">
        <div>総キー数: {Object.keys(sourceData).length}</div>
        <div>検索結果: {filteredKeys.length}</div>
        <div>進捗: {progress}%</div>
      </div>
      
      <div 
        className="flex-1 overflow-hidden relative" 
        ref={listContainerRef}
      >
        {filteredKeys.length > 0 ? (
          <List
            ref={listRef}
            height={listHeight}
            width="100%"
            itemCount={itemCount}
            itemSize={itemHeight}
            overscanCount={5}
            className="list-container"
          >
            {renderListItem}
          </List>
        ) : (
          <div className="flex justify-center items-center h-full p-4 text-gray-500 dark:text-gray-400">
            該当するキーがありません
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm">ファイル形式:</span>
          <select 
            value={fileFormat}
            onChange={(e) => onFormatChange(e.target.value as 'json' | 'lang')}
            className="py-1 px-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="json">JSON形式 (.json)</option>
            <option value="lang">Lang形式 (.lang)</option>
          </select>
        </div>
        
        <button 
          onClick={onDownload}
          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          翻訳ファイルをダウンロード
        </button>
      </div>

      {/* 一括置換確認ダイアログ */}
      {showReplaceConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in border border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-bold mb-4">置換の確認</h3>
            <p className="mb-2">
              以下の置換を実行します：
            </p>
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="mb-2">
                <span className="font-medium">検索語：</span>
                <span className="ml-1 bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">{searchTerm}</span>
              </div>
              <div>
                <span className="font-medium">置換語：</span>
                <span className="ml-1 bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">{replaceText}</span>
              </div>
            </div>
            <p className="text-amber-600 dark:text-amber-400 text-sm mb-4">
              この操作はフィルターに一致する全てのテキストに適用されます。
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelReplaceAll}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                キャンセル
              </button>
              <button 
                onClick={confirmReplaceAll}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                一括置換する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}