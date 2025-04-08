import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '../components/ErrorBoundary';

// ダイアログの型定義
type DialogProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  inputPlaceholder?: string;
  error?: Error | null; // エラー情報を追加
  validationError?: string | null | undefined; // 入力バリデーションエラー
};

// ダイアログコンポーネント
const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
  showCancel = true,
  inputValue,
  setInputValue,
  inputPlaceholder,
  error,
  validationError
}) => {
  // マウント時にダイアログ外のスクロールを防止
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escキーでダイアログを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onCancel) {
        onCancel();
      } else if (e.key === 'Enter' && isOpen && !showCancel) {
        // Enterキーで確定（確認ダイアログでは無効）
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onConfirm, onCancel, showCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        className={`relative z-[10000] w-full max-w-md rounded-lg shadow-xl ${error ? 'bg-red-50 dark:bg-red-900/20 border border-red-500' : 'bg-white dark:bg-gray-800'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        {title && (
          <div className={`border-b px-6 py-4 ${error ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'}`}>
            <h3 className={`text-lg font-medium ${error ? 'text-red-700 dark:text-red-300' : 'text-gray-900 dark:text-white'}`}>
              {error ? 'エラーが発生しました' : title}
            </h3>
          </div>
        )}

        {/* 本文 */}
        <div className="px-6 py-4">
          <p className={`mb-4 whitespace-pre-line text-base ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {error ? error.message : message}
          </p>

          {/* エラーの詳細情報（スタックトレース）を折りたたみ表示 */}
          {error && error.stack && (
            <details className="mb-2 cursor-pointer">
              <summary className="font-medium text-red-600 dark:text-red-400">詳細情報</summary>
              <pre className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-800 text-sm overflow-auto max-h-60">
                {error.stack}
              </pre>
            </details>
          )}

          {/* 入力フィールドの表示（エラーの有無に関わらず表示） */}
          {setInputValue && (
            <div className="space-y-2">
              <input
                type="text"
                className={`w-full rounded-md border ${validationError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} px-3 py-2 shadow-sm focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                value={inputValue || ''}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputPlaceholder || ''}
                autoFocus
              />
              {validationError && (
                <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
              )}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className={`flex justify-end space-x-2 border-t px-6 py-4 ${error ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'}`}>
          {!error && showCancel && onCancel && (
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            className={`rounded-md border border-transparent ${error ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            onClick={onConfirm}
          >
            {error ? '閉じる' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ダイアログユーティリティ関数
export const dialog = {
  // アラートダイアログを表示
  alert: (message: string, options: { title?: string; confirmLabel?: string } = {}): Promise<void> => {
    return new Promise((resolve) => {
      const dialogContainer = document.createElement('div');
      document.body.appendChild(dialogContainer);
      
      // React 18のcreateRootを使用
      const root = ReactDOM.createRoot(dialogContainer);

      const AlertComponent = () => {
        const [isOpen, setIsOpen] = useState(false);
        
        useEffect(() => {
          // マウント後にダイアログを表示
          const timer = setTimeout(() => setIsOpen(true), 10);
          return () => clearTimeout(timer);
        }, []);
        
        const handleConfirm = () => {
          setIsOpen(false);
          // アニメーション分待ってからクリーンアップ
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(dialogContainer);
            resolve();
          }, 300);
        };

        const handleError = (error: Error) => {
          console.error('ダイアログでエラーが発生しました:', error);
          setIsOpen(false);
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(dialogContainer);
            resolve();
          }, 300);
        };
        
        return (
          <ErrorBoundary
            onError={handleError}
            fallback={(error) => (
              <Dialog
                isOpen={true}
                title="エラーが発生しました"
                message={error.message}
                confirmLabel="閉じる"
                onConfirm={handleConfirm}
                showCancel={false}
                error={error}
              />
            )}
          >
            <Dialog
              isOpen={isOpen}
              title={options.title || 'お知らせ'}
              message={message}
              confirmLabel={options.confirmLabel || 'OK'}
              onConfirm={handleConfirm}
              showCancel={false}
            />
          </ErrorBoundary>
        );
      };
      
      root.render(<AlertComponent />);
    });
  },

  // 確認ダイアログを表示
  confirm: (message: string, options: { 
    title?: string; 
    confirmLabel?: string; 
    cancelLabel?: string;
    onConfirm?: () => void; // onConfirmプロパティを追加
    onCancel?: () => void;  // onCancelプロパティを追加
  } = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      const dialogContainer = document.createElement('div');
      document.body.appendChild(dialogContainer);
      
      // React 18のcreateRootを使用
      const root = ReactDOM.createRoot(dialogContainer);

      const ConfirmComponent = () => {
        const [isOpen, setIsOpen] = useState(false);
        
        useEffect(() => {
          // マウント後にダイアログを表示
          const timer = setTimeout(() => setIsOpen(true), 10);
          return () => clearTimeout(timer);
        }, []);
        
        const handleConfirm = () => {
          setIsOpen(false);
          // アニメーション分待ってからクリーンアップ
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(dialogContainer);
            resolve(true);
          }, 300);
          // オプションで渡されたonConfirmを実行
          if (options.onConfirm) {
            options.onConfirm();
          }
        };
        
        const handleCancel = () => {
          setIsOpen(false);
          // アニメーション分待ってからクリーンアップ
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(dialogContainer);
            resolve(false);
          }, 300);
          // オプションで渡されたonCancelを実行
          if (options.onCancel) {
            options.onCancel();
          }
        };

        const handleError = (error: Error) => {
          console.error('ダイアログでエラーが発生しました:', error);
          setIsOpen(false);
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(dialogContainer);
            resolve(false); // エラー時はキャンセル扱い
          }, 300);
        };
        
        return (
          <ErrorBoundary
            onError={handleError}
            fallback={(error) => (
              <Dialog
                isOpen={true}
                title="エラーが発生しました"
                message={error.message}
                confirmLabel="閉じる"
                onConfirm={handleCancel}
                showCancel={false}
                error={error}
              />
            )}
          >
            <Dialog
              isOpen={isOpen}
              title={options.title || '確認'}
              message={message}
              confirmLabel={options.confirmLabel || 'はい'}
              cancelLabel={options.cancelLabel || 'いいえ'}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              showCancel={true}
            />
          </ErrorBoundary>
        );
      };
      
      root.render(<ConfirmComponent />);
    });
  },

  // プロンプトダイアログを表示
  prompt: (message: string, defaultValue: string = '', options: { 
    title?: string; 
    confirmLabel?: string; 
    cancelLabel?: string; 
    placeholder?: string;
    validator?: (value: string) => string | null;
  } = {}): Promise<string | null> => {
    return new Promise((resolve) => {
      const dialogContainer = document.createElement('div');
      document.body.appendChild(dialogContainer);
      
      // React 18のcreateRootを使用
      const root = ReactDOM.createRoot(dialogContainer);

      const PromptComponent = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [inputValue, setInputValue] = useState(defaultValue);
        const [validationError, setValidationError] = useState<string | null>(null);
        
        useEffect(() => {
          // マウント後にダイアログを表示
          const timer = setTimeout(() => setIsOpen(true), 10);
          return () => clearTimeout(timer);
        }, []);
        
        const validateAndConfirm = () => {
          // バリデーション関数が提供されている場合は実行
          if (options.validator) {
            const error = options.validator(inputValue);
            if (error) {
              setValidationError(error);
              return;
            }
          }
          
          // 入力が空でないか確認（デフォルトのバリデーション）
          if (inputValue.trim() === '') {
            setValidationError('入力は必須です');
            return;
          }
          
          setIsOpen(false);
          // アニメーション分待ってからクリーンアップ
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(dialogContainer);
            resolve(inputValue);
          }, 300);
        };
        
        const handleCancel = () => {
          setIsOpen(false);
          // アニメーション分待ってからクリーンアップ
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(dialogContainer);
            resolve(null);
          }, 300);
        };

        const handleError = (error: Error) => {
          console.error('ダイアログでエラーが発生しました:', error);
          setIsOpen(false);
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(dialogContainer);
            resolve(null); // エラー時はキャンセル扱い
          }, 300);
        };
        
        return (
          <ErrorBoundary
            onError={handleError}
            fallback={(error) => (
              <Dialog
                isOpen={true}
                title="エラーが発生しました"
                message={error.message}
                confirmLabel="閉じる"
                onConfirm={handleCancel}
                showCancel={false}
                error={error}
              />
            )}
          >
            <Dialog
              isOpen={isOpen}
              title={options.title || '入力'}
              message={message}
              confirmLabel={options.confirmLabel || '確定'}
              cancelLabel={options.cancelLabel || 'キャンセル'}
              onConfirm={validateAndConfirm}
              onCancel={handleCancel}
              showCancel={true}
              inputValue={inputValue}
              setInputValue={setInputValue}
              inputPlaceholder={options.placeholder || defaultValue}
              validationError={validationError}
            />
          </ErrorBoundary>
        );
      };
      
      root.render(<PromptComponent />);
    });
  },

  // エラーダイアログを表示
  error: (error: Error, options: { title?: string; confirmLabel?: string } = {}): Promise<void> => {
    return new Promise((resolve) => {
      const dialogContainer = document.createElement('div');
      document.body.appendChild(dialogContainer);
      
      // React 18のcreateRootを使用
      const root = ReactDOM.createRoot(dialogContainer);

      const ErrorComponent = () => {
        const [isOpen, setIsOpen] = useState(false);
        
        useEffect(() => {
          // マウント後にダイアログを表示
          const timer = setTimeout(() => setIsOpen(true), 10);
          return () => clearTimeout(timer);
        }, []);
        
        const handleConfirm = () => {
          setIsOpen(false);
          // アニメーション分待ってからクリーンアップ
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(dialogContainer);
            resolve();
          }, 300);
        };
        
        return (
          <Dialog
            isOpen={isOpen}
            title={options.title || 'エラーが発生しました'}
            message={''}
            confirmLabel={options.confirmLabel || '閉じる'}
            onConfirm={handleConfirm}
            showCancel={false}
            error={error}
          />
        );
      };
      
      root.render(<ErrorComponent />);
    });
  }
};