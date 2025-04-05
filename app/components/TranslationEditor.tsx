import { useState, useEffect } from 'react';
import type { LanguageData } from '../util/load/fileloader';
import { highlightText, highlightRegexMatches } from '../util/highlight';
import { hasContent } from '../util/stringUtils';

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
  // 置換モード関連のプロパティ
  isReplaceMode?: boolean;
  replaceInfo?: {
    keys: string[];
    currentIndex: number;
    searchText: string;
    replaceText: string;
    total: number;
  } | null;
  onApplyReplacement?: () => void;
  onSkipReplacement?: () => void;
  onCancelReplacement?: () => void;
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
  isRegexSearch = false,
  // 置換モード関連
  isReplaceMode = false,
  replaceInfo = null,
  onApplyReplacement,
  onSkipReplacement,
  onCancelReplacement
}: TranslationEditorProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<'all' | 'current'>('all');

  // 置換プレビューを生成
  const generateReplacedText = (): { before: string, after: string } | null => {
    if (!isReplaceMode || !replaceInfo || !selectedKey || !sourceData) return null;
    
    // 現在のテキスト（置換前）
    const currentValue = editedValue;
    
    // 置換後のテキスト
    const { searchText, replaceText } = replaceInfo;
    const afterValue = currentValue.split(searchText).join(replaceText);
    
    return {
      before: currentValue,
      after: afterValue
    };
  };

  // 置換テキスト
  const replacedText = generateReplacedText();

  // 既存のコピー機能
  const handleCopyAllClick = () => {
    setConfirmationAction('all');
    setShowConfirmation(true);
  };

  const handleCopyCurrentClick = () => {
    setConfirmationAction('current');
    setShowConfirmation(true);
  };

  const confirmCopy = () => {
    if (confirmationAction === 'all') {
      onCopyAllSourceTexts();
    } else {
      onCopyCurrentKeySource();
    }
    setShowConfirmation(false);
  };

  const cancelCopy = () => {
    setShowConfirmation(false);
  };

  if (!selectedKey) {
    return (
      <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded p-4 overflow-auto bg-white dark:bg-gray-800 relative">
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            リストからキーを選択してください
          </p>
          <button 
            onClick={handleCopyAllClick}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            すべての翻訳元テキストをコピー
          </button>

          {showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in border border-gray-300 dark:border-gray-600">
                <h3 className="text-lg font-bold mb-4">確認</h3>
                <p className="mb-6">すべての翻訳元テキストを翻訳先にコピーしますか？この操作は元に戻せません。</p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={cancelCopy}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    キャンセル
                  </button>
                  <button 
                    onClick={confirmCopy}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    コピーする
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded p-4 overflow-auto bg-white dark:bg-gray-800 relative">
      <div className="flex flex-col h-full">
        {/* ヘッダー部分: 置換モードの場合は置換情報を表示 */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            選択中のキー: 
            <span className="ml-1">
              {hasContent(searchTerm) 
                ? (isRegexSearch ? highlightRegexMatches(selectedKey, searchTerm) : highlightText(selectedKey, searchTerm))
                : selectedKey}
            </span>
            {isReplaceMode && replaceInfo && (
              <span className="ml-2 text-sm text-amber-600 dark:text-amber-400">
                (置換 {replaceInfo.currentIndex + 1}/{replaceInfo.total})
              </span>
            )}
          </h3>
          
          {isReplaceMode ? (
            <div className="flex gap-2">
              <button
                onClick={onCancelReplacement}
                className="text-sm bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded"
              >
                置換をキャンセル
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleCopyCurrentClick}
                className="text-sm bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-1 rounded"
                title="このキーの翻訳元テキストを翻訳先にコピーします"
              >
                原文からコピー
              </button>
              <button 
                onClick={handleCopyAllClick}
                className="text-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1 rounded"
                title="すべての翻訳元テキストを翻訳先にコピーします"
              >
                原文からすべてをコピー
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">原文:</label>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded min-h-[5rem] whitespace-pre-wrap">
            {hasContent(searchTerm) 
              ? (isRegexSearch 
                ? highlightRegexMatches(sourceData[selectedKey], searchTerm) 
                : highlightText(sourceData[selectedKey], searchTerm))
              : sourceData[selectedKey]}
          </div>
        </div>

        <div className="mb-4 flex-1">
          <label className="block font-medium mb-2">翻訳:</label>
          
          {/* 置換モードの時は差分表示のみ（編集テキストボックスは非表示） */}
          {isReplaceMode && replacedText ? (
            <div className="space-y-3 border border-gray-200 dark:border-gray-700 rounded p-4 bg-gray-50 dark:bg-gray-800">
              {/* 置換前後の差分表示エリア */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">置換前:</div>
                  <div className="p-2 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 whitespace-pre-wrap text-sm min-h-[5rem] max-h-[10rem] overflow-auto">
                    {hasContent(searchTerm) && replaceInfo
                      ? highlightText(replacedText.before, replaceInfo.searchText, 'bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-200')
                      : replacedText.before}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">置換後:</div>
                  <div className="p-2 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 whitespace-pre-wrap text-sm min-h-[5rem] max-h-[10rem] overflow-auto">
                    {replaceInfo ? (
                      <>
                        {replacedText.after.split(replaceInfo.replaceText).map((part, i, arr) => (
                          <>
                            {part}
                            {i < arr.length - 1 && (
                              <span className="bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-200">
                                {replaceInfo.replaceText}
                              </span>
                            )}
                          </>
                        ))}
                      </>
                    ) : (
                      replacedText.after
                    )}
                  </div>
                </div>
              </div>
              
              {/* 置換操作ボタン */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={onCancelReplacement}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={onSkipReplacement}
                  className="px-3 py-1.5 text-sm border border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/30 rounded text-yellow-700 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800/50"
                >
                  スキップ
                </button>
                <button
                  onClick={onApplyReplacement}
                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  置換する
                </button>
              </div>
            </div>
          ) : (
            // 通常モード時は編集テキストボックスを表示
            <textarea
              value={editedValue}
              onChange={(e) => onEditedValueChange(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded resize-y min-h-[10rem] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          )}
        </div>

        <div className="flex justify-end">
          {!isReplaceMode && (
            <button 
              onClick={onUpdateTranslation}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              更新
            </button>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in border border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">確認</h3>
              <button 
                onClick={cancelCopy}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                {confirmationAction === 'all' 
                  ? 'すべての翻訳元テキストを翻訳先にコピーしますか？' 
                  : `選択中のキー "${selectedKey}" の翻訳元テキストを翻訳先にコピーしますか？`}
              </p>
              <p className="mt-2 text-amber-600 dark:text-amber-400 text-sm font-medium">
                この操作は元に戻せません。
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelCopy}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
              <button 
                onClick={confirmCopy}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                コピーする
              </button>
            </div>
          </div>
        </div>  
      )} 
    </div> 
  );
}