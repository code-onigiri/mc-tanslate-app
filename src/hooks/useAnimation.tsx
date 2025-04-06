import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  applyHardwareAcceleration, 
  resetHardwareAcceleration,
  nextFrame,
  addAnimationClass
} from '../util/animation';

/**
 * アニメーションクラスを動的に追加・削除するためのフック
 */
export function useAnimation() {
  // アニメーション対象の要素IDとそのアニメーションクラスを管理
  const [animations, setAnimations] = useState<Record<string, string>>({});
  // タイマーIDを保持するためのref
  const timerRefs = useRef<Record<string, number>>({});
  // マウント状態を保持
  const isMountedRef = useRef(true);

  useEffect(() => {
    // コンポーネントがマウントされている
    isMountedRef.current = true;
    
    // クリーンアップ関数
    return () => {
      isMountedRef.current = false;
      // すべてのタイマーをクリア
      Object.keys(timerRefs.current).forEach(key => {
        clearTimeout(timerRefs.current[key]);
      });
    };
  }, []);

  /**
   * アニメーションを開始する関数
   * @param id 要素の一意のID
   * @param animationClass 適用するアニメーションのクラス名
   * @param duration アニメーションの持続時間（ミリ秒）
   * @param callback アニメーション終了後に実行するコールバック関数
   * @param forceAnimation すでにアニメーションが適用されていても強制的に適用するかどうか
   */
  const triggerAnimation = useCallback((
    id: string, 
    animationClass: string, 
    duration = 250, // デフォルト時間を短縮
    callback?: () => void,
    forceAnimation = false
  ) => {
    // 既存のタイマーがあればクリア
    if (timerRefs.current[id]) {
      clearTimeout(timerRefs.current[id]);
      delete timerRefs.current[id];
    }
    
    // 既にアニメーションクラスが設定されている場合は何もしない（forceAnimationがtrueの場合は除く）
    if (!forceAnimation && animations[id]) {
      return;
    }
    
    // 対象の要素を取得
    const element = document.getElementById(id);
    
    // アニメーションを開始する前に一度ステート更新
    setAnimations(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    
    // フェードイン/スライドフェードインアニメーションの場合のDOM直接操作
    if (animationClass.includes('fade-in') || animationClass.includes('slide-fade-in')) {
      if (element) {
        // アニメーション前に不透明度を設定
        element.style.opacity = '0';
        // ハードウェアアクセラレーションを適用
        applyHardwareAcceleration(element);
      }
    }
    
    // 実際のアニメーションを実行
    // 次の描画フレームでアニメーションを開始（アニメーションユーティリティを使用）
    nextFrame(() => {
      if (!isMountedRef.current) return;
      
      // アニメーションクラスを設定
      setAnimations(prev => ({
        ...prev,
        [id]: animationClass
      }));
      
      if (element) {
        // クラスの追加とリフローの強制
        addAnimationClass(element, animationClass);
      }
      
      // 指定時間後にアニメーションクラスを削除
      const timerId = window.setTimeout(() => {
        if (!isMountedRef.current) return;
        
        setAnimations(prev => {
          const newAnimations = { ...prev };
          delete newAnimations[id];
          return newAnimations;
        });
        
        // アニメーション終了後、フェードイン系アニメーションの場合は要素が確実に表示されるようにする
        if (element) {
          if (animationClass.includes('fade-in') || animationClass.includes('slide-fade-in')) {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
          }
          // ハードウェアアクセラレーションをリセット
          resetHardwareAcceleration(element);
        }
        
        // タイマーIDをクリア
        delete timerRefs.current[id];
        
        // コールバックがあれば実行
        if (callback) {
          callback();
        }
      }, duration + 50); // 少し余裕を持たせる
      
      // タイマーIDを保存
      timerRefs.current[id] = timerId;
    });
  }, []);
  
  // 各種アニメーション関数
  const triggerClickAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-click', 200, callback);
  }, [triggerAnimation]);
  
  const triggerFadeInAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-fade-in', 250, callback);
  }, [triggerAnimation]);
  
  const triggerFadeOutAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-fade-out', 200, callback);
  }, [triggerAnimation]);
  
  const triggerSlideFadeInAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-slide-fade-in', 250, callback);
  }, [triggerAnimation]);
  
  const triggerSlideFadeOutAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-slide-fade-out', 200, callback);
  }, [triggerAnimation]);
  
  const triggerSlideDownAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-slide-down', 300, callback);
  }, [triggerAnimation]);
  
  const triggerSlideUpAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-slide-up', 200, callback);
  }, [triggerAnimation]);
  
  // 特定の要素に適用すべきアニメーションクラスを取得
  const getAnimationClass = useCallback((id: string) => {
    return animations[id] || '';
  }, [animations]);

  // クリーンアップ関数
  const cleanupAnimations = useCallback(() => {
    Object.keys(timerRefs.current).forEach(key => {
      if (key.endsWith('_frame')) {
        cancelAnimationFrame(timerRefs.current[key]);
      } else {
        clearTimeout(timerRefs.current[key]);
      }
    });
    timerRefs.current = {};
    setAnimations({});
  }, []);

  return {
    animations,
    triggerAnimation,
    triggerClickAnimation,
    triggerFadeInAnimation,
    triggerFadeOutAnimation,
    triggerSlideFadeInAnimation,
    triggerSlideFadeOutAnimation,
    triggerSlideDownAnimation,
    triggerSlideUpAnimation,
    getAnimationClass,
    cleanupAnimations,
  };
}
