import { useState } from 'react';
import { dialog } from '../../util/dialog';

/**
 * UI操作に関連する機能を提供するカスタムフック
 */
export const useUIInteractions = () => {
    const [clickedButton, setClickedButton] = useState<string | null>(null);

    /**
     * ボタンクリックアニメーションを実行する
     */
    const handleButtonClick = (buttonId: string, callback: () => void) => {
        setClickedButton(buttonId);
        
        setTimeout(() => {
            setClickedButton(null);
            callback();
        }, 150);
    };

    /**
     * ErrorBoundary用のエラーハンドラー
     */
    const handleEditPageError = (error: Error) => {
        console.error('EditPageでエラーが発生しました:', error);
        dialog.error(error, {
            title: '翻訳エディタでエラーが発生しました',
            confirmLabel: '閉じる'
        });
    };

    return {
        clickedButton,
        handleButtonClick,
        handleEditPageError
    };
};
