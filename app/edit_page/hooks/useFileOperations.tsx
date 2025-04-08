import { useState } from 'react';
import { loadLanguageData, saveLanguageData, type LanguageData } from '../../util/load/fileloader';
import { dialog } from '../../util/dialog';

/**
 * ファイル操作に関連する機能を提供するカスタムフック
 */
export const useFileOperations = () => {
    const [sourceData, setSourceData] = useState<LanguageData | null>(null);
    const [targetData, setTargetData] = useState<LanguageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [targetFileName, setTargetFileName] = useState<string | null>(null);
    const [fileFormat, setFileFormat] = useState<'json' | 'lang'>('json');

    /**
     * ソースファイルを読み込む
     */
    const handleSourceFileChange = async (file: File) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await loadLanguageData(file);
            setSourceData(data);
        } catch (err) {
            dialog.error(err instanceof Error ? err : new Error(String(err)), {
                title: 'ソースファイル読み込みエラー',
                confirmLabel: '閉じる'
            });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * ターゲットファイルを読み込む
     */
    const handleTargetFileChange = async (file: File) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await loadLanguageData(file);
            setTargetData(data);
            setTargetFileName(file.name);
            
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (extension === 'lang') {
                setFileFormat('lang');
            } else {
                setFileFormat('json');
            }
        } catch (err) {
            dialog.error(err instanceof Error ? err : new Error(String(err)), {
                title: 'ターゲットファイル読み込みエラー',
                confirmLabel: '閉じる'
            });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 新規ファイルを作成する
     */
    const handleCreateNewTarget = (format: 'json' | 'lang' = 'json') => {
        setTargetData({});
        setTargetFileName(format === 'json' ? 'ja_jp.json' : 'ja_jp.lang');
        setFileFormat(format);
    };

    /**
     * ファイル形式を変更する
     */
    const handleFormatChange = (format: 'json' | 'lang') => {
        setFileFormat(format);
        if (targetFileName) {
            const baseName = targetFileName.split('.')[0];
            setTargetFileName(`${baseName}.${format}`);
        }
    };

    /**
     * ファイルをダウンロードする
     */
    const handleDownload = () => {
        if (!targetData) return;
        
        const baseName = targetFileName 
            ? targetFileName.split('.')[0] 
            : 'ja_jp';
        
        const fileName = `${baseName}.${fileFormat}`;
        saveLanguageData(targetData, fileFormat, fileName);
    };

    return {
        sourceData,
        setSourceData,
        targetData,
        setTargetData,
        isLoading,
        error,
        setError,
        targetFileName,
        fileFormat,
        handleSourceFileChange,
        handleTargetFileChange,
        handleCreateNewTarget,
        handleFormatChange,
        handleDownload
    };
};
