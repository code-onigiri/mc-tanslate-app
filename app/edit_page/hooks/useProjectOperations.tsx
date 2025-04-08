import { exportProject, importProject } from '../../util/project/projectManager';
import { dialog } from '../../util/dialog';
import type { LanguageData } from '../../util/load/fileloader';

/**
 * プロジェクトファイルの操作に関連する機能を提供するカスタムフック
 */
export const useProjectOperations = (
    sourceData: LanguageData | null,
    setSourceData: (data: LanguageData) => void,
    targetData: LanguageData | null,
    setTargetData: (data: LanguageData) => void,
    fileFormat: 'json' | 'lang',
    setFileFormat: (format: 'json' | 'lang') => void,
    targetFileName: string | null,
    setTargetFileName: (name: string | null) => void,
    setIsLoading: (isLoading: boolean) => void,
    setError: (error: string | null) => void
) => {
    /**
     * プロジェクトをエクスポートする
     */
    const handleProjectExport = async () => {
        if (!sourceData || !targetData) {
            dialog.error(new Error('エクスポートするには翻訳元と翻訳先の両方のデータが必要です'), {
                title: 'エクスポートエラー',
                confirmLabel: '閉じる'
            });
            return;
        }

        const baseName = targetFileName 
            ? targetFileName.split('.')[0] 
            : 'minecraft_translation_project';

        try {
            const validateFileName = (value: string): string | null => {
                if (!value || value.trim() === '') {
                    return 'ファイル名を入力してください';
                }
                return null;
            };

            const userFileName = await dialog.prompt('エクスポートするファイル名を入力してください', baseName, {
                title: 'プロジェクトのエクスポート',
                confirmLabel: 'エクスポート',
                validator: validateFileName
            });
            
            if (userFileName === null) {
                return;
            }

            await exportProject(
                sourceData,
                targetData,
                fileFormat,
                fileFormat,
                userFileName.trim()
            );
            
            dialog.alert('プロジェクトを正常にエクスポートしました', {
                title: 'エクスポート成功',
                confirmLabel: 'OK'
            });
        } catch (err) {
            dialog.error(err instanceof Error ? err : new Error(String(err)), {
                title: 'エクスポートエラー',
                confirmLabel: '閉じる'
            });
        }
    };

    /**
     * プロジェクトをインポートする
     */
    const handleProjectImport = async (file: File) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const { sourceData: newSourceData, targetData: newTargetData, targetFormat } = await importProject(file);
            
            setSourceData(newSourceData);
            setTargetData(newTargetData);
            setFileFormat(targetFormat);
            
            const baseName = file.name.split('.')[0];
            setTargetFileName(`${baseName}.${targetFormat}`);
            
            dialog.alert('プロジェクトを正常にインポートしました', {
                title: 'インポート成功',
                confirmLabel: 'OK'
            });
        } catch (err) {
            dialog.error(err instanceof Error ? err : new Error(String(err)), {
                title: 'インポートエラー',
                confirmLabel: '閉じる'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleProjectExport,
        handleProjectImport
    };
};
