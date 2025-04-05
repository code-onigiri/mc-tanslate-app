import React from 'react';

interface SettingsDropdownProps {
  darkMode: 'system' | 'light' | 'dark';
  onThemeChange: (theme: 'system' | 'light' | 'dark') => void;
  listPosition: 'left' | 'right';
  onListPositionChange: (position: 'left' | 'right') => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDropdown({
  darkMode,
  onThemeChange,
  listPosition,
  onListPositionChange,
  isOpen,
  onClose
}: SettingsDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2 animate-fade-in">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">全体設定</h3>
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
