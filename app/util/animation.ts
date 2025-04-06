/**
 * アニメーションのパフォーマンスを最適化するためのヘルパー関数
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
  
  // Classがすでに存在している場合は一度削除
  element.classList.remove(className);
  
  // フォースリフロー（再計算を強制）
  void element.offsetWidth;
  
  // クラスを追加
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
    // 要素を非表示にしてからアニメーションで表示
    element.style.opacity = '0';
    requestAnimationFrame(() => {
      element.style.transition = 'opacity 300ms ease-in-out';
      requestAnimationFrame(() => {
        element.style.opacity = '1';
      });
    });
  } else {
    // 要素をフェードアウト
    element.style.transition = 'opacity 250ms ease-in-out';
    element.style.opacity = '0';
  }
}
