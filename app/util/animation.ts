/**
 * アニメーション関連のユーティリティ関数
 */

/**
 * 要素にハードウェアアクセラレーションを適用する
 * @param element 対象のDOM要素
 */
export function applyHardwareAcceleration(element: HTMLElement | null) {
  if (!element) return;
  
  element.style.willChange = 'transform, opacity';
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
}

/**
 * ハードウェアアクセラレーションをリセットする
 * @param element 対象のDOM要素
 */
export function resetHardwareAcceleration(element: HTMLElement | null) {
  if (!element) return;
  
  element.style.willChange = 'auto';
  element.style.transform = '';
  element.style.backfaceVisibility = '';
}

/**
 * 次の描画フレームで実行するコールバック
 * @param callback 実行する関数
 */
export function nextFrame(callback: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

/**
 * アニメーション関連のクラスを追加
 * @param element 対象の要素
 * @param className 追加するクラス名
 */
export function addAnimationClass(element: HTMLElement | null, className: string) {
  if (!element) return;
  element.classList.add(className);
}

/**
 * 指定の要素を非表示にして、アニメーション後に表示する
 * @param elementId 対象の要素ID
 * @param isVisible 表示/非表示
 */
export function setVisibilityWithAnimation(elementId: string, isVisible: boolean) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  if (isVisible) {
    // 表示の場合：フェードインアニメーション
    element.style.opacity = '0';
    element.style.display = '';
    
    // 次のフレームでアニメーション開始
    requestAnimationFrame(() => {
      element.classList.add('animate-fade-in');
      element.style.opacity = '1';
      
      // アニメーション終了時にクラスを削除
      element.addEventListener('animationend', function handler() {
        element.classList.remove('animate-fade-in');
        element.removeEventListener('animationend', handler);
      }, { once: true });
    });
  } else {
    // 非表示の場合：フェードアウトアニメーション
    element.classList.add('animate-fade-out');
    
    // アニメーション終了後に要素を非表示
    element.addEventListener('animationend', function handler() {
      element.style.display = 'none';
      element.classList.remove('animate-fade-out');
      element.removeEventListener('animationend', handler);
    }, { once: true });
  }
}
