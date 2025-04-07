import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileUploader } from './FileUploader';
import { AboutPopup } from './AboutPopup';

interface HamburgerMenuProps {
  onSourceFileSelect: (file: File) => void;
  onTargetFileSelect: (file: File) => void;
  onCreateNewTarget: () => void;
  isLoading: boolean;
  selectedTargetFileName: string | null;
  fileFormat: 'json' | 'lang';
  onFormatChange: (format: 'json' | 'lang') => void;
  triggerClickAnimation: (id: string, callback?: () => void) => void;
  triggerSlideFadeOutAnimation: (id: string, callback?: () => void) => void;
  triggerSlideFadeInAnimation: (id: string, callback?: () => void) => void;
  getAnimationClass: (id: string) => string;
  onProjectExport?: () => void; // プロジェクトファイル(.mcta)をエクスポートする関数
  onProjectImport?: (file: File) => void; // プロジェクトファイル(.mcta)をインポートする関数
}

export function HamburgerMenu({
  onSourceFileSelect,
  onTargetFileSelect,
  onCreateNewTarget,
  isLoading,
  selectedTargetFileName,
  fileFormat,
  onFormatChange,
  triggerClickAnimation,
  triggerSlideFadeOutAnimation,
  triggerSlideFadeInAnimation,
  getAnimationClass,
  onProjectExport,
  onProjectImport
}: HamburgerMenuProps) {
  // メニューの開閉状態
  const [isOpen, setIsOpen] = useState(false);
  // ファイル設定サブメニューの開閉状態
  const [fileSettingsOpen, setFileSettingsOpen] = useState(false);
  // 「このアプリについて」ポップアップの開閉状態
  const [aboutPopupOpen, setAboutPopupOpen] = useState(false);
  // プロジェクトファイルのインポート用のref
  const projectImportRef = useRef<HTMLInputElement>(null);
  // メニュー要素への参照
  const menuRef = useRef<HTMLDivElement>(null);
  // ハンバーガーボタンへの参照
  const buttonRef = useRef<HTMLButtonElement>(null);
  // ファイル設定サブメニューへの参照
  const submenuRef = useRef<HTMLDivElement>(null);

  // メニューの開閉を切り替える
  const toggleMenu = () => {
    triggerClickAnimation('hamburger-button', () => {
      setIsOpen(!isOpen);
      // メニューを閉じたらファイル設定も閉じる
      if (!isOpen === false) {
        setFileSettingsOpen(false);
      }
    });
  };

  // ファイル設定の開閉を切り替える
  const toggleFileSettings = () => {
    triggerClickAnimation('file-settings-button', () => {
      setFileSettingsOpen(!fileSettingsOpen);
    });
  };

  // 「このアプリについて」ポップアップを開く
  const openAboutPopup = () => {
    triggerClickAnimation('about-button', () => {
      setAboutPopupOpen(true);
      // ポップアップを開いたらメニューを閉じる
      setIsOpen(false);
      setFileSettingsOpen(false);
    });
  };

  // 「このアプリについて」ポップアップを閉じる
  const closeAboutPopup = () => {
    setAboutPopupOpen(false);
  };

  // プロジェクトファイルのインポートを処理する関数
  const handleProjectImport = () => {
    if (!onProjectImport) return;
    
    triggerClickAnimation('project-import-button', () => {
      projectImportRef.current?.click();
    });
  };

  // プロジェクトファイルのエクスポートを処理する関数
  const handleProjectExport = () => {
    if (!onProjectExport) return;
    
    triggerClickAnimation('project-export-button', () => {
      onProjectExport();
    });
  };

  // ファイル選択時の処理
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !onProjectImport) return;
    
    onProjectImport(files[0]);
    
    // 選択後にinputをリセット
    if (event.target) {
      event.target.value = '';
    }
  };

  // メニュー外クリック検出用のイベントリスナー
  useEffect(() => {
    // メニューが閉じている場合は何もしない
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      // ボタン、メニュー内、またはサブメニュー内のクリックは無視
      if (
        buttonRef.current?.contains(event.target as Node) ||
        menuRef.current?.contains(event.target as Node) ||
        submenuRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      
      // メニュー外のクリックでメニューを閉じる
      setIsOpen(false);
      setFileSettingsOpen(false);
    }

    // クリックイベントリスナーを追加
    document.addEventListener("mousedown", handleClickOutside);
    
    // クリーンアップ関数
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // isOpenが変更されたときだけ再評価

  return (
    <div className="relative">
      {/* ハンバーガーアイコンボタン */}
      <button
        id="hamburger-button"
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
        aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
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

      {/* ドロップダウンメニュー - 左側に表示 */}
      {isOpen && (
        <div
          id="hamburger-menu"
          ref={menuRef}
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
      )}

      {/* ファイル設定サブメニュー - 右側に表示 */}
      {isOpen && fileSettingsOpen && (
        <div
          id="file-settings-submenu"
          ref={submenuRef}
          className="absolute left-[300px] top-0 w-[500px] max-w-[95vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                     border border-gray-200 dark:border-gray-700 z-50 animate-slide-right"
          style={{ transformOrigin: 'top left' }}
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">ファイル設定</h3>
              <button
                onClick={() => setFileSettingsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
      )}

      {/* 「このアプリについて」ポップアップ */}
      <AboutPopup isOpen={aboutPopupOpen} onClose={closeAboutPopup} />
    </div>
  );
}