/**
 * テーマ関連のユーティリティ関数
 */

/**
 * アプリケーション起動時にテーマの初期設定を行う
 */
export function initializeTheme(): void {
  const savedTheme = localStorage.getItem('theme-preference');
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    // darkクラスを追加
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    // darkクラスを削除
    document.documentElement.classList.remove('dark');
  } else {
    // システム設定に合わせる
    document.documentElement.removeAttribute('data-theme');
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

/**
 * メディアクエリの変更を監視（システム設定変更時）
 * クリーンアップ関数を返す
 */
export function setupThemeListener(): (() => void) | undefined {
  if (window.matchMedia) {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme-preference');
      
      // システム設定に合わせる場合のみ反映
      if (savedTheme !== 'dark' && savedTheme !== 'light') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    colorSchemeQuery.addEventListener('change', handleChange);
    
    // クリーンアップ関数を返す
    return () => colorSchemeQuery.removeEventListener('change', handleChange);
  }
  
  return undefined;
}

/**
 * テーマを変更する
 * @param theme テーマの種類（'system', 'light', 'dark'）
 */
export function changeTheme(theme: 'system' | 'light' | 'dark'): void {
  // HTML要素のdata-theme属性とdarkクラスを設定
  const htmlEl = document.documentElement;
  
  if (theme === 'system') {
    htmlEl.removeAttribute('data-theme');
    
    // システム設定に合わせて切り替え
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
  } else if (theme === 'dark') {
    htmlEl.setAttribute('data-theme', 'dark');
    htmlEl.classList.add('dark');
  } else {
    htmlEl.setAttribute('data-theme', 'light');
    htmlEl.classList.remove('dark');
  }
  
  // 設定を保存
  localStorage.setItem('theme-preference', theme);
}
