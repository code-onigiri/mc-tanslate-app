import React, { useEffect, useRef } from 'react';

interface SettingsDropdownProps {
  darkMode: 'system' | 'light' | 'dark';
  onThemeChange: (theme: 'system' | 'light' | 'dark') => void;
  listPosition: 'left' | 'right';
  onListPositionChange: (position: 'left' | 'right') => void;
  onClose: () => void;
  animationId: string;
  getAnimationClass: (id: string) => string;
  triggerClickAnimation: (id: string, callback?: () => void) => void;
  triggerSlideFadeInAnimation: (id: string, callback?: () => void) => void;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
}

export function SettingsDropdown({
  darkMode,
  onThemeChange,
  listPosition,
  onListPositionChange,
  onClose,
  animationId,
  getAnimationClass,
  triggerClickAnimation,
  triggerSlideFadeInAnimation,
  isAnimating,
  setIsAnimating
}: SettingsDropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false); // アニメーションが既に実行されたかを追跡

  // コンポーネントのマウント時の処理
  useEffect(() => {
    // 1. ハードウェアアクセラレーションの適用
    if (menuRef.current) {
      menuRef.current.style.willChange = 'transform, opacity';
      menuRef.current.style.transform = 'translateZ(0)';
    }
    
    // 2. アニメーション開始
    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      
      // 次のフレームでアニメーションを開始（少し遅延を入れる）
      setTimeout(() => {
        const element = document.getElementById(animationId);
        if (element) {
          // 最初は非表示に
          element.style.opacity = '0';
          
          // アニメーション実行
          requestAnimationFrame(() => {
            triggerSlideFadeInAnimation(animationId, () => {
              setIsAnimating(false);
              
              // アニメーション完了後に確実に表示されるようにする
              if (element) {
                element.style.opacity = '1';
              }
            });
          });
        }
      }, 20);
    }
    
    // クリーンアップ関数
    return () => {
      hasAnimatedRef.current = false;
    };
  }, [animationId, triggerSlideFadeInAnimation, setIsAnimating]);

  // 閉じるボタンのクリックアニメーション
  const handleCloseClick = () => {
    triggerClickAnimation('close-settings-button', onClose);
  };

  return (
    <div 
      id={animationId}
      ref={menuRef}
      className={`absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                 border border-gray-200 dark:border-gray-700 z-50 py-2 opacity-0 transition-opacity duration-200 ${getAnimationClass(animationId)}`}
      style={{ transformOrigin: 'top right' }}
    >
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">全体設定</h3>
          <button
            onClick={handleCloseClick}
            className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${getAnimationClass('close-settings-button')}`}
            aria-label="閉じる"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* テーマ設定 */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">表示テーマ</p>
        
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              checked={darkMode === 'system'}
              onChange={() => onThemeChange('system')}
              className="text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">システム設定に合わせる</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              checked={darkMode === 'light'}
              onChange={() => onThemeChange('light')}
              className="text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">ライトモード</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              checked={darkMode === 'dark'}
              onChange={() => onThemeChange('dark')}
              className="text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">ダークモード</span>
          </label>
        </div>
      </div>
      
      {/* リスト位置設定 */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">リスト表示位置</p>
        
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="listPosition"
              checked={listPosition === 'right'}
              onChange={() => onListPositionChange('right')}
              className="text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">右側にリストを表示</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="listPosition"
              checked={listPosition === 'left'}
              onChange={() => onListPositionChange('left')}
              className="text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">左側にリストを表示</span>
          </label>
        </div>
      </div>
      
      {/* 設定保存ボタン */}
      <div className="px-4 py-2 mt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          設定は自動的に保存されます
        </p>
      </div>
    </div>
  );
}
