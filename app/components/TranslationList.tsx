import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { FilterType } from '../edit_page/types';
import type { LanguageData } from '../util/load/fileloader';
import { TranslationFilters, type SortOrder } from './TranslationFilters';
import { dialog } from '../util/dialog';
import { ErrorBoundary } from './ErrorBoundary';
import { SearchBar } from './SearchBox';
import { ListHeader } from './ListHeader';
import { TranslationListItem } from './TranslationListItem';
import { ListFooter } from './ListFooter';

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
  fileFormat: 'json' | 'lang';
  onFormatChange: (format: 'json' | 'lang') => void;
  isRegexSearch: boolean;
  setIsRegexSearch: (isRegex: boolean) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

/**
 * 翻訳リストコンポーネント
 * 翻訳するキーと値のリストを表示し、検索・フィルタリング機能を提供する
 */
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
  fileFormat,
  onFormatChange,
  isRegexSearch,
  setIsRegexSearch,
  sortOrder,
  onSortChange
}: TranslationListProps) {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const [listHeight, setListHeight] = useState(500);
  
  const [regexError, setRegexError] = useState<string | null>(null);

  // コンテナサイズの測定と更新
  useEffect(() => {
    const measureContainer = () => {
      if (listContainerRef.current) {
        const rect = listContainerRef.current.getBoundingClientRect();
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

  // リストアイテムのレンダリング関数
  const renderListItem = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const key = filteredKeys[index];
    const isSelected = key === selectedKey;

    return (
      <TranslationListItem 
        key={key}
        itemKey={key}
        sourceValue={sourceData[key]}
        targetValue={targetData[key]}
        isSelected={isSelected}
        searchTerm={searchTerm}
        isRegexSearch={isRegexSearch}
        onSelectKey={onSelectKey}
        style={style}
      />
    );
  }, [filteredKeys, selectedKey, sourceData, targetData, searchTerm, isRegexSearch, onSelectKey]);

  const handleListError = useCallback((error: Error) => {
    dialog.alert(`翻訳リストでエラーが発生しました: ${error.message}`, {
      title: 'エラー',
      confirmLabel: '閉じる'
    });
  }, []);

  const listContent = () => {
    return (
      <div className="w-2/5 flex flex-col border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 h-full relative">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          {/* 検索バー */}
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isRegexSearch={isRegexSearch}
            setIsRegexSearch={setIsRegexSearch}
            regexError={regexError}
          />
          
          {/* フィルターコンポーネント */}
          <TranslationFilters 
            filterType={filterType}
            onFilterChange={onFilterChange}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
        </div>
        
        {/* リストヘッダー - 統計情報 */}
        <ListHeader 
          totalKeys={Object.keys(sourceData).length}
          filteredKeysCount={filteredKeys.length}
          progress={progress}
        />
        
        {/* リスト本体 */}
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
        
        {/* リストフッター - ダウンロードボタンとファイル形式選択 */}
        <ListFooter 
          fileFormat={fileFormat}
          onFormatChange={onFormatChange}
          onDownload={onDownload}
        />
      </div>
    );
  };

  return (
    <ErrorBoundary
      onError={handleListError}
      fallback={(error, resetError) => (
        <div className="w-2/5 flex flex-col border border-red-500 rounded bg-red-50 dark:bg-red-900/20 h-full relative">
          <div className="p-4 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4">
              翻訳リストでエラーが発生しました
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error.message}</p>
            <div className="flex-1"></div>
            <div className="flex justify-end">
              <button 
                onClick={resetError}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                aria-label="リストを再読み込み"
              >
                再読み込み
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {listContent()}
    </ErrorBoundary>
  );
}