import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * エラーバウンダリコンポーネント
 * 子コンポーネントでのエラーをキャッチし、フォールバックUIを表示します
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // エラーが発生した場合の状態を更新
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // エラー情報をログに記録
    console.error('エラーバウンダリがエラーをキャッチしました:', error, errorInfo);
    
    // onErrorプロパティが存在する場合は呼び出す
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // fallbackプロパティが関数の場合
      if (typeof fallback === 'function') {
        return fallback(error, this.resetError);
      }
      
      // fallbackプロパティがReactNodeの場合
      if (fallback) {
        return fallback;
      }
      
      // デフォルトのフォールバックUI
      return (
        <div className="p-4 border border-red-500 rounded-md bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 relative">
          <div className="absolute top-2 right-2">
            <button
              onClick={this.resetError}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
              aria-label="閉じる"
            >
              ☓
            </button>
          </div>
          <h2 className="text-lg font-bold mb-2">エラーが発生しました</h2>
          <p className="mb-2">{error.message}</p>
          <details className="cursor-pointer mb-4">
            <summary className="font-medium">詳細</summary>
            <pre className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-sm overflow-auto">
              {error.stack}
            </pre>
          </details>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            再試行
          </button>
        </div>
      );
    }

    return children;
  }
}