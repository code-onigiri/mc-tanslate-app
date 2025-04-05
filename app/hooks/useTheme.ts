import { useState, useEffect } from 'react';
import { changeTheme } from '../util/themeUtils';

/**
 * テーマ設定のためのカスタムフック
 * @returns [現在のテーマ, テーマを変更する関数]
 */
export function useTheme() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

  // 初期化時に保存された設定を読み込む
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference') as 'system' | 'light' | 'dark' || 'system';
    setTheme(savedTheme);
  }, []);

  // テーマを変更する関数
  const handleThemeChange = (newTheme: 'system' | 'light' | 'dark') => {
    setTheme(newTheme);
    changeTheme(newTheme);
  };

  return [theme, handleThemeChange] as const;
}
