import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MenuButton } from './MenuButton';
import { DropdownMenu } from './DropdownMenu';
import { FileSettingsSubmenu } from './FileSettingsSubmenu';
import { dialog } from '../util/dialog';

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
  // プロジェクトファイルのインポート用のref
  const projectImportRef = useRef<HTMLInputElement>(null);
  // メニュー要素への参照
  const menuRef = useRef<HTMLDivElement>(null);
  // ハンバーガーボタンへの参照
  const buttonRef = useRef<HTMLButtonElement>(null);
  // ファイル設定サブメニューへの参照
  const submenuRef = useRef<HTMLDivElement>(null);

  // メニューの開閉を切り替える
  const toggleMenu = useCallback(() => {
    triggerClickAnimation('hamburger-button', () => {
      setIsOpen(!isOpen);
      // メニューを閉じたらファイル設定も閉じる
      if (!isOpen === false) {
        setFileSettingsOpen(false);
      }
    });
  }, [isOpen, triggerClickAnimation]);

  // ファイル設定の開閉を切り替える
  const toggleFileSettings = useCallback(() => {
    triggerClickAnimation('file-settings-button', () => {
      setFileSettingsOpen(!fileSettingsOpen);
    });
  }, [fileSettingsOpen, triggerClickAnimation]);

  // 「このアプリについて」ポップアップを開く
  const openAboutPopup = useCallback(async () => {
    triggerClickAnimation('about-button', async () => {
      // メニューを閉じる
      setIsOpen(false);
      setFileSettingsOpen(false);
      
      // ダイアログユーティリティを使用してAboutダイアログを表示
      await dialog.alert(
        `MC-TranslateはMinecraftの.lang,.jsonファイルを簡単に翻訳できるようにするアプリです。\n\n© ${new Date().getFullYear()} MC-Translate App`,
        {
          title: 'About MC-Translate',
          confirmLabel: '閉じる'
        }
      );
    });
  }, [triggerClickAnimation]);

  // プロジェクトファイルのインポートを処理する関数
  const handleProjectImport = useCallback(() => {
    if (!onProjectImport) return;
    
    triggerClickAnimation('project-import-button', () => {
      projectImportRef.current?.click();
    });
  }, [onProjectImport, triggerClickAnimation]);

  // プロジェクトファイルのエクスポートを処理する関数
  const handleProjectExport = useCallback(() => {
    if (!onProjectExport) return;
    
    triggerClickAnimation('project-export-button', () => {
      onProjectExport();
    });
  }, [onProjectExport, triggerClickAnimation]);

  // ファイル設定を閉じる関数
  const handleCloseSettings = useCallback(() => {
    setFileSettingsOpen(false);
  }, []);

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
      <MenuButton 
        id="hamburger-button"
        ref={buttonRef}
        isOpen={isOpen}
        onClick={toggleMenu}
      />

      {/* ドロップダウンメニュー */}
      <div ref={menuRef}>
        <DropdownMenu
          isOpen={isOpen}
          toggleFileSettings={toggleFileSettings}
          fileSettingsOpen={fileSettingsOpen}
          openAboutPopup={openAboutPopup}
          handleProjectImport={handleProjectImport}
          handleProjectExport={handleProjectExport}
          projectImportRef={projectImportRef}
          onProjectImport={onProjectImport}
        />
      </div>

      {/* ファイル設定サブメニュー */}
      <div ref={submenuRef}>
        <FileSettingsSubmenu
          isOpen={isOpen}
          fileSettingsOpen={fileSettingsOpen}
          onCloseSettings={handleCloseSettings}
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