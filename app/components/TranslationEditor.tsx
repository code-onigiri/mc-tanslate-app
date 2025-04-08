import { useState, useCallback } from 'react';
import type { LanguageData } from '../util/load/fileloader';
import { dialog } from '../util/dialog';
import { ErrorBoundary } from './ErrorBoundary';
import { SourceTextDisplay } from './SourceTextDisplay';
import { NoSelectionView } from './NoSelectionView';
import { EditorHeader } from './EditorHeader';

/**
 * 翻訳エディタコンポーネント
 * 原文と翻訳を編集するためのインターフェースを提供する
 */
interface TranslationEditorProps {
  selectedKey: string | null;
  sourceData: LanguageData;
  editedValue: string;
  onEditedValueChange: (value: string) => void;
  onUpdateTranslation: () => void;
  onCopyAllSourceTexts: () => void;
  onCopyCurrentKeySource: () => void;
  searchTerm?: string;
  isRegexSearch?: boolean;
}

export function TranslationEditor({ 
  selectedKey, 
  sourceData, 
  editedValue, 
  onEditedValueChange, 
  onUpdateTranslation,
  onCopyAllSourceTexts,
  onCopyCurrentKeySource,
  searchTerm = '',
  isRegexSearch = false
}: TranslationEditorProps) {

  // すべてコピーボタンのクリックハンドラ
  const handleCopyAllClick = useCallback(async () => {
    const confirmed = await dialog.confirm('すべての翻訳元テキストを翻訳先にコピーしますか？この操作は元に戻せません。', {
      title: '確認',
      confirmLabel: 'コピーする',
      cancelLabel: 'キャンセル'
    });
    
    if (confirmed) {
      onCopyAllSourceTexts();
    }
  }, [onCopyAllSourceTexts]);

  // 現在の原文コピーボタンのクリックハンドラ
  const handleCopyCurrentClick = async () => {
    if (!selectedKey) return;
    
    const confirmed = await dialog.confirm(`選択中のキー "${selectedKey}" の翻訳元テキストを翻訳先にコピーしますか？この操作は元に戻せません。`, {
      title: '確認',
      confirmLabel: 'コピーする',
      cancelLabel: 'キャンセル'
    });
    
    if (confirmed) {
      onCopyCurrentKeySource();
    }
  };

  // エラー処理
  const handleEditorError = (error: Error) => {
    dialog.error(error, {
      title: '翻訳エディタでエラーが発生しました',
      confirmLabel: '閉じる'
    });
  };

  // エディタコンテンツの条件付きレンダリング
  const editorContent = () => {
    if (!selectedKey) {
      return <NoSelectionView onCopyAllClick={handleCopyAllClick} />;
    }

    return (
      <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded p-4 overflow-auto bg-white dark:bg-gray-800 relative">
        <div className="flex flex-col h-full">
          <EditorHeader 
            selectedKey={selectedKey}
            searchTerm={searchTerm}
            isRegexSearch={isRegexSearch}
            onCopyCurrentClick={handleCopyCurrentClick}
            onCopyAllClick={handleCopyAllClick}
          />

          <div className="mb-4">
            <label className="block font-medium mb-2">原文:</label>
            <SourceTextDisplay 
              text={sourceData[selectedKey]} 
              searchTerm={searchTerm} 
              isRegexSearch={isRegexSearch} 
            />
          </div>

          <div className="mb-4 flex-1">
            <label className="block font-medium mb-2">翻訳:</label>
            <textarea
              value={editedValue}
              onChange={(e) => onEditedValueChange(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded resize-y min-h-[10rem] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              aria-label="翻訳テキスト入力欄"
            />
          </div>

          <div className="flex justify-end">
            <button 
              onClick={onUpdateTranslation}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              aria-label="翻訳を更新"
            >
              更新
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary 
      onError={handleEditorError}
      fallback={(error, resetError) => (
        <div className="flex-1 border border-red-500 rounded p-4 overflow-auto bg-red-50 dark:bg-red-900/20">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4">
              翻訳エディタでエラーが発生しました
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-2">{error.message}</p>
            <div className="flex-1"></div>
            <div className="flex justify-end">
              <button 
                onClick={resetError}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                aria-label="エディタを再読み込み"
              >
                再読み込み
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {editorContent()}
    </ErrorBoundary>
  );
}