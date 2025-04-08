import React from 'react';
import { FileUploader } from './FileUploader';

interface FileSettingsSubmenuProps {
  isOpen: boolean;
  fileSettingsOpen: boolean;
  submenuId?: string;
  onCloseSettings: () => void;
  onSourceFileSelect: (file: File) => void;
  onTargetFileSelect: (file: File) => void;
  onCreateNewTarget: () => void;
  isLoading: boolean;
  selectedTargetFileName: string | null;
  fileFormat: 'json' | 'lang';
  onFormatChange: (format: 'json' | 'lang') => void;
  triggerClickAnimation: (id: string, callback?: () => void) => void;
}

/**
 * ファイル設定サブメニューコンポーネント
 * ハンバーガーメニューから開くファイル関連の設定を表示する
 */
export function FileSettingsSubmenu({
  isOpen,
  fileSettingsOpen,
  submenuId = 'file-settings-submenu',
  onCloseSettings,
  onSourceFileSelect,
  onTargetFileSelect,
  onCreateNewTarget,
  isLoading,
  selectedTargetFileName,
  fileFormat,
  onFormatChange,
  triggerClickAnimation
}: FileSettingsSubmenuProps) {
  if (!isOpen || !fileSettingsOpen) return null;

  return (
    <div
      id={submenuId}
      className="absolute left-[300px] top-0 w-[500px] max-w-[95vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                 border border-gray-200 dark:border-gray-700 z-50 animate-slide-right"
      style={{ transformOrigin: 'top left' }}
    >
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">ファイル設定</h3>
          <button
            onClick={onCloseSettings}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
      </div>

      {/* ファイルアップローダー */}
      <div className="p-3">
        <FileUploader 
          onSourceFileSelect={onSourceFileSelect}
          onTargetFileSelect={onTargetFileSelect}
          onCreateNewTarget={onCreateNewTarget}
          isLoading={isLoading}
          selectedTargetFileName={selectedTargetFileName}
          fileFormat={fileFormat}
          onFormatChange={onFormatChange}
          triggerClickAnimation={triggerClickAnimation}
        />
      </div>
    </div>
  );
}