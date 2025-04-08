import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAnimation } from '../../hooks/useAnimation';

/**
 * アプリケーション設定に関連する機能を提供するカスタムフック
 */
export const useSettings = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [isSettingsAnimating, setIsSettingsAnimating] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const [listPosition, setListPosition] = useState<'left' | 'right'>('right');
    const [theme, handleThemeChange] = useTheme();
    
    const {
        getAnimationClass,
        triggerClickAnimation,
        triggerSlideFadeInAnimation,
        triggerSlideFadeOutAnimation,
        triggerSlideDownAnimation,
        triggerSlideUpAnimation
    } = useAnimation();

    // リスト位置設定の保存/読み込み
    useEffect(() => {
        const savedListPosition = localStorage.getItem('list-position') as 'left' | 'right';
        if (savedListPosition) {
            setListPosition(savedListPosition);
        }
    }, []);

    // 設定メニュー外のクリックで閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                handleCloseSettings();
            }
        };

        if (showSettings) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSettings]);

    /**
     * 設定メニューを開閉する
     */
    const handleOpenSettings = () => {
        triggerClickAnimation('settings-button', () => {
            if (showSettings) {
                handleCloseSettings();
            } else {
                setIsSettingsAnimating(true);
                setShowSettings(true);
            }
        });
    };
    
    /**
     * 設定メニューを閉じる
     */
    const handleCloseSettings = () => {
        if (showSettings) {
            setIsSettingsAnimating(true);
            triggerSlideFadeOutAnimation('settings-menu', () => {
                setIsSettingsAnimating(false);
                setShowSettings(false);
            });
        }
    };
    
    /**
     * リスト位置を変更する
     */
    const handleListPositionChange = (position: 'left' | 'right') => {
        setListPosition(position);
        localStorage.setItem('list-position', position);
    };

    return {
        theme,
        handleThemeChange,
        showSettings,
        isSettingsAnimating,
        setIsSettingsAnimating,
        settingsRef,
        listPosition,
        getAnimationClass,
        triggerClickAnimation,
        triggerSlideFadeInAnimation,
        triggerSlideFadeOutAnimation,
        triggerSlideDownAnimation,
        triggerSlideUpAnimation,
        handleOpenSettings,
        handleCloseSettings,
        handleListPositionChange
    };
};
