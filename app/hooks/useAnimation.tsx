import { useState, useCallback, useRef, useEffect } from 'react';
import { applyHardwareAcceleration, resetHardwareAcceleration } from '../util/animation';

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
   */
  const triggerAnimation = useCallback((
    id: string, 
    animationClass: string, 
    duration = 250,
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
    if (element) {
      // ハードウェアアクセラレーションを適用
      applyHardwareAcceleration(element);
    }
    
    // アニメーションを開始する前に一度ステート更新
    setAnimations(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    
    // アニメーションクラスを設定
    setAnimations(prev => ({
      ...prev,
      [id]: animationClass
    }));
    
    // 指定時間後にアニメーションクラスを削除
    const timerId = window.setTimeout(() => {
      if (!isMountedRef.current) return;
      
      setAnimations(prev => {
        const newAnimations = { ...prev };
        delete newAnimations[id];
        return newAnimations;
      });
      
      // ハードウェアアクセラレーションをリセット
      if (element) {
        resetHardwareAcceleration(element);
      }
      
      // タイマーIDをクリア
      delete timerRefs.current[id];
      
      // コールバックがあれば実行
      if (callback) {
        callback();
      }
    }, duration);
    
    // タイマーIDを保存
    timerRefs.current[id] = timerId;
  }, [animations]);
  
  // クリックアニメーション
  const triggerClickAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-click', 150, callback);
  }, [triggerAnimation]);
  
  // フェードインアニメーション
  const triggerFadeInAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-fade-in', 250, callback);
  }, [triggerAnimation]);
  
  // フェードアウトアニメーション
  const triggerFadeOutAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-fade-out', 200, callback);
  }, [triggerAnimation]);
  
  // スライドフェードインアニメーション
  const triggerSlideFadeInAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-slide-fade-in', 250, callback);
  }, [triggerAnimation]);
  
  // スライドフェードアウトアニメーション
  const triggerSlideFadeOutAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-slide-fade-out', 200, callback);
  }, [triggerAnimation]);
  
  // スライドダウンアニメーション
  const triggerSlideDownAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-slide-down', 300, callback);
  }, [triggerAnimation]);
  
  // スライドアップアニメーション
  const triggerSlideUpAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-slide-up', 200, callback);
  }, [triggerAnimation]);
  
  // スライド右方向アニメーション
  const triggerSlideRightAnimation = useCallback((id: string, callback?: () => void) => {
    triggerAnimation(id, 'animate-slide-right', 300, callback);
  }, [triggerAnimation]);
  
  // 特定の要素に適用すべきアニメーションクラスを取得
  const getAnimationClass = useCallback((id: string) => {
    return animations[id] || '';
  }, [animations]);

  // クリーンアップ関数
  const cleanupAnimations = useCallback(() => {
    Object.keys(timerRefs.current).forEach(key => {
      clearTimeout(timerRefs.current[key]);
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
    triggerSlideRightAnimation,
    getAnimationClass,
    cleanupAnimations,
  };
}
