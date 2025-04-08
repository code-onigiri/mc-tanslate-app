import React, { type ButtonHTMLAttributes, forwardRef } from 'react';

interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  id?: string;
}

/**
 * ハンバーガーメニューのアイコンボタンコンポーネント
 * アニメーション付きのメニューボタンを表示する
 */
export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ isOpen, id = 'hamburger-button', className = '', ...props }, ref) => {
    return (
      <button
        id={id}
        ref={ref}
        className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 ${className}`}
        aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        {...props}
      >
        <div className="w-6 h-6 relative flex justify-center items-center">
          {/* 上の線 */}
          <span 
            className={`absolute h-0.5 w-5 bg-current transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'rotate-45' : '-translate-y-1.5'
            }`}
          />
          {/* 中央の線 */}
          <span 
            className={`absolute h-0.5 w-5 bg-current transition-opacity duration-300 ease-in-out ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {/* 下の線 */}
          <span 
            className={`absolute h-0.5 w-5 bg-current transform transition-transform duration-300 ease-in-out ${
              isOpen ? '-rotate-45' : 'translate-y-1.5'
            }`}
          />
        </div>
      </button>
    );
  }
);