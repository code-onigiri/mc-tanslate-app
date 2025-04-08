import React, { useRef } from 'react';

interface DropdownMenuProps {
  isOpen: boolean;
  menuId?: string;
  toggleFileSettings: () => void;
  fileSettingsOpen: boolean;
  openAboutPopup: () => void;
  handleProjectImport: () => void;
  handleProjectExport: () => void;
  projectImportRef: React.RefObject<HTMLInputElement | null>
  onProjectImport?: (file: File) => void;
}

/**
 * ハンバーガーメニューのドロップダウン部分を表示するコンポーネント
 */
export function DropdownMenu({
  isOpen,
  menuId = 'hamburger-menu',
  toggleFileSettings,
  fileSettingsOpen,
  openAboutPopup,
  handleProjectImport,
  handleProjectExport,
  projectImportRef,
  onProjectImport
}: DropdownMenuProps) {
  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !onProjectImport) return;
    
    onProjectImport(files[0]);
    
    // 選択後にinputをリセット
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div
      id={menuId}
      className="absolute left-0 top-full mt-2 w-[300px] max-w-[95vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                 border border-gray-200 dark:border-gray-700 z-50 animate-slide-down"
      style={{ transformOrigin: 'top left' }}
    >
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">メニュー</h3>
      </div>

      <div className="p-0">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li>
            <button
              id="file-settings-button"
              onClick={toggleFileSettings}
              className="w-full px-4 py-3 flex items-center text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="mr-2">📁</span>
              <span>ファイル設定</span>
              <span className="ml-auto transform transition-transform duration-300" style={{ transform: fileSettingsOpen ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
          </li>
          <li>
            <button
              id="about-button"
              onClick={openAboutPopup}
              className="w-full px-4 py-3 flex items-center text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="mr-2">ℹ️</span>
              <span>このアプリについて</span>
            </button>
          </li>
          <li>
            <a
              href="https://github.com/code-onigiri/mc-tanslate-app"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="mr-2">🔗</span>
              <span>GitHub</span>
            </a>
          </li>
          <li>
            <button
              id="project-import-button"
              onClick={handleProjectImport}
              className="w-full px-4 py-3 flex items-center text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="mr-2">📤</span>
              <span>プロジェクトをインポート</span>
            </button>
            <input
              type="file"
              ref={projectImportRef}
              onChange={handleFileChange}
              accept=".mcta"
              className="hidden"
            />
          </li>
          <li>
            <button
              id="project-export-button"
              onClick={handleProjectExport}
              className="w-full px-4 py-3 flex items-center text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="mr-2">📥</span>
              <span>プロジェクトをエクスポート</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}