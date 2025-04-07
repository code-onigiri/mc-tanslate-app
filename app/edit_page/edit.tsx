import { useState, useEffect, useRef } from 'react';
import { TranslationEditor } from '../components/TranslationEditor';
import { TranslationList } from '../components/TranslationList';
import { loadLanguageData, saveLanguageData, type LanguageData } from '../util/load/fileloader';
import { exportProject, importProject } from '../util/project/projectManager';
import { useTranslationFilters } from '../hooks/useTranslationFilters';
import { useTheme } from '../hooks/useTheme';
import { useReplacement } from '../hooks/useReplacement';
import { useAnimation } from '../hooks/useAnimation';
import { SettingsDropdown } from '../components/SettingsDropdown';
import { HamburgerMenu } from '../components/HamburgerMenu';
import type { SortOrder } from '../components/TranslationFilters';

// フィルタータイプの定義
export type FilterType = 'all' | 'translated' | 'untranslated';

function EditPage() {
    // ファイルとデータの状態
    const [sourceData, setSourceData] = useState<LanguageData | null>(null);
    const [targetData, setTargetData] = useState<LanguageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [targetFileName, setTargetFileName] = useState<string | null>(null);
    const [fileFormat, setFileFormat] = useState<'json' | 'lang'>('json');
    
    // 検索と編集の状態
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [isRegexSearch, setIsRegexSearch] = useState(false);
    // 並び替え状態
    const [sortOrder, setSortOrder] = useState<SortOrder>('none');
    
    // UI設定とアニメーションの状態
    const [showSettings, setShowSettings] = useState(false);
    const [isSettingsAnimating, setIsSettingsAnimating] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const [listPosition, setListPosition] = useState<'left' | 'right'>('right');
    const [clickedButton, setClickedButton] = useState<string | null>(null);
    
    // カスタムフックの使用
    const [theme, handleThemeChange] = useTheme();
    const {
        isReplaceMode,
        replaceInfo,
        startReplacement,
        replaceAll,
        applyCurrentReplacement,
        skipCurrentReplacement,
        cancelReplacement
    } = useReplacement();
    const {
        getAnimationClass,
        triggerClickAnimation,
        triggerSlideFadeInAnimation,
        triggerSlideFadeOutAnimation,
        triggerSlideDownAnimation,
        triggerSlideUpAnimation
    } = useAnimation();
    
    // フィルタリングロジックをカスタムフックに委譲
    const filteredKeys = useTranslationFilters(
        sourceData, 
        targetData, 
        searchTerm, 
        filterType, 
        isRegexSearch,
        sortOrder
    );

    // 設定メニュー外のクリックで閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                // アニメーション付きで閉じる
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

    // リスト位置設定の保存/読み込み
    useEffect(() => {
        const savedListPosition = localStorage.getItem('list-position') as 'left' | 'right';
        if (savedListPosition) {
            setListPosition(savedListPosition);
        }
    }, []);
    
    // クリックアニメーションを追加する関数
    const handleButtonClick = (buttonId: string, callback: () => void) => {
        setClickedButton(buttonId);
        
        // アニメーション後に実行する処理
        setTimeout(() => {
            setClickedButton(null);
            callback();
        }, 150);
    };

    // 設定メニューを開閉する
    const handleOpenSettings = () => {
        triggerClickAnimation('settings-button', () => {
            if (showSettings) {
                // すでに開いている場合は閉じる
                handleCloseSettings();
            } else {
                // 閉じている場合は開く
                setIsSettingsAnimating(true);
                setShowSettings(true);
            }
        });
    };
    
    // 設定メニューを閉じる
    const handleCloseSettings = () => {
        // メニューが表示されている場合のみアニメーションを実行
        if (showSettings) {
            setIsSettingsAnimating(true);
            triggerSlideFadeOutAnimation('settings-menu', () => {
                setIsSettingsAnimating(false);
                setShowSettings(false);
            });
        }
    };
    
    const handleListPositionChange = (position: 'left' | 'right') => {
        setListPosition(position);
        localStorage.setItem('list-position', position);
    };

    // ファイル読み込み関連の処理
    const handleSourceFileChange = async (file: File) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await loadLanguageData(file);
            setSourceData(data);
        } catch (err) {
            setError(`ソースファイルの読み込みに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTargetFileChange = async (file: File) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await loadLanguageData(file);
            setTargetData(data);
            // ファイル名を保存
            setTargetFileName(file.name);
            
            // ファイル拡張子からフォーマットを設定
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (extension === 'lang') {
                setFileFormat('lang');
            } else {
                setFileFormat('json');
            }
        } catch (err) {
            setError(`ターゲットファイルの読み込みに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 新規ファイル作成
    const handleCreateNewTarget = (format: 'json' | 'lang' = 'json') => {
        setTargetData({});
        setTargetFileName(format === 'json' ? 'ja_jp.json' : 'ja_jp.lang');
        setFileFormat(format);
    };

    // ファイル形式変更
    const handleFormatChange = (format: 'json' | 'lang') => {
        setFileFormat(format);
        if (targetFileName) {
            const baseName = targetFileName.split('.')[0];
            setTargetFileName(`${baseName}.${format}`);
        }
    };

    // JSONをダウンロード
    const handleDownload = () => {
        if (!targetData) return;
        
        const baseName = targetFileName 
            ? targetFileName.split('.')[0] 
            : 'ja_jp';
        
        const fileName = `${baseName}.${fileFormat}`;
        saveLanguageData(targetData, fileFormat, fileName);
    };

    // プロジェクトファイル関連の処理
    const handleProjectExport = async () => {
        if (!sourceData || !targetData) {
            setError('エクスポートするには翻訳元と翻訳先の両方のデータが必要です');
            return;
        }

        const baseName = targetFileName 
            ? targetFileName.split('.')[0] 
            : 'minecraft_translation_project';

        const userFileName = window.prompt('エクスポートするファイル名を入力してください', baseName);
        if (!userFileName) {
            setError('ファイル名が入力されていません');
            return;
        }

        try {
            await exportProject(
                sourceData,
                targetData,
                fileFormat, // 現在のfileFormatを翻訳元と翻訳先の両方に使用
                fileFormat,
                userFileName
            );
        } catch (err) {
            setError(`プロジェクトのエクスポートに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const handleProjectImport = async (file: File) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const { sourceData: newSourceData, targetData: newTargetData, targetFormat } = await importProject(file);
            
            setSourceData(newSourceData);
            setTargetData(newTargetData);
            setFileFormat(targetFormat);
            
            // ファイル名を設定（プロジェクトファイル名から拡張子を除いたもの + 形式の拡張子）
            const baseName = file.name.split('.')[0];
            setTargetFileName(`${baseName}.${targetFormat}`);
            
        } catch (err) {
            setError(`プロジェクトのインポートに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 編集関連の処理
    const handleSelectKey = (key: string) => {
        setSelectedKey(key);
        setEditedValue(targetData && key in targetData ? targetData[key] : '');
    };

    const handleUpdateTranslation = () => {
        if (!selectedKey || !targetData) return;
        
        const updatedTargetData = {
            ...targetData,
            [selectedKey]: editedValue
        };
        
        setTargetData(updatedTargetData);
    };

    // コピー関連の処理
    const handleCopyAllSourceTexts = () => {
        if (!sourceData || !targetData) return;
        
        const updatedTargetData = { ...targetData };
        
        Object.keys(sourceData).forEach(key => {
            updatedTargetData[key] = sourceData[key];
        });
        
        setTargetData(updatedTargetData);
        
        if (selectedKey) {
            setEditedValue(sourceData[selectedKey]);
        }
    };

    const handleCopyCurrentKeySource = () => {
        if (!sourceData || !targetData || !selectedKey) return;
        
        const updatedTargetData = {
            ...targetData,
            [selectedKey]: sourceData[selectedKey]
        };
        
        setTargetData(updatedTargetData);
        setEditedValue(sourceData[selectedKey]);
    };

    // フィルター変更
    const handleFilterChange = (newFilter: FilterType) => {
        setFilterType(newFilter);
    };

    // ソート順変更
    const handleSortChange = (newSortOrder: SortOrder) => {
        setSortOrder(newSortOrder);
    };

    // 進捗率計算
    const calculateProgress = (): number => {
        if (!sourceData || !targetData) return 0;
        const totalKeys = Object.keys(sourceData).length;
        if (totalKeys === 0) return 0;
        const translatedKeys = Object.keys(sourceData).filter(key => key in targetData).length;
        return Math.round((translatedKeys / totalKeys) * 100);
    };

    // 置換関連の処理
    const handleReplaceAll = (searchText: string, replaceText: string) => {
        if (!targetData || !searchText || !replaceText) return;
        
        const updatedTargetData = replaceAll(searchText, replaceText, filteredKeys, targetData, isRegexSearch);
        setTargetData(updatedTargetData);
        
        if (selectedKey && selectedKey in updatedTargetData) {
            setEditedValue(updatedTargetData[selectedKey]);
        }
        
        alert(`置換が完了しました。`);
    };

    const handleReplaceWithConfirmation = (searchText: string, replaceText: string) => {
        if (!targetData || !searchText || !replaceText) return;
        
        // 置換作業を開始し、最初のキーを取得
        const firstKey = startReplacement(searchText, replaceText, filteredKeys, targetData, isRegexSearch);
        
        // 最初のキーが有効ならそれを選択
        if (firstKey && typeof firstKey === 'string') {
            handleSelectKey(firstKey);
        }
    };

    const handleApplyReplacement = () => {
        if (!targetData || !selectedKey) return;
        
        // 現在の置換を適用
        const { updatedData, newValue } = applyCurrentReplacement(targetData, selectedKey, isRegexSearch);
        
        // データを更新
        setTargetData(updatedData);
        setEditedValue(newValue);
        
        // 次の置換対象に進む
        const nextKey = skipCurrentReplacement();
        
        // 次のキーがあれば選択
        if (nextKey && typeof nextKey === 'string') {
            setTimeout(() => {
                handleSelectKey(nextKey);
            }, 10);
        }
    };

    const handleSkipReplacement = () => {
        // 現在の置換をスキップして次に進む
        const nextKey = skipCurrentReplacement();
        
        // 次のキーがあれば選択
        if (nextKey && typeof nextKey === 'string') {
            setTimeout(() => {
                handleSelectKey(nextKey);
            }, 10);
        }
    };

    return (
        <div className="flex flex-col h-screen p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="mb-1 relative">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-3">
                        {/* ハンバーガーメニュー（ファイルアップローダーを含む） - 左側に配置 */}
                        <HamburgerMenu
                            onSourceFileSelect={handleSourceFileChange}
                            onTargetFileSelect={handleTargetFileChange}
                            onCreateNewTarget={() => handleCreateNewTarget(fileFormat)}
                            isLoading={isLoading}
                            selectedTargetFileName={targetFileName}
                            fileFormat={fileFormat}
                            onFormatChange={handleFormatChange}
                            triggerClickAnimation={triggerClickAnimation}
                            triggerSlideFadeOutAnimation={triggerSlideFadeOutAnimation}
                            triggerSlideFadeInAnimation={triggerSlideFadeInAnimation}
                            getAnimationClass={getAnimationClass}
                            onProjectExport={handleProjectExport}
                            onProjectImport={handleProjectImport}
                        />
                        
                        <h1 className="text-2xl font-bold animate-fade-in ml-2">Minecraft 翻訳エディタ</h1>
                    </div>
                    
                    {/* 設定ボタン - 右側に配置 */}
                    <div className="relative" ref={settingsRef}>
                        <button
                            onClick={handleOpenSettings}
                            className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${getAnimationClass('settings-button')}`}
                            aria-label="設定"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        
                        {/* 設定ドロップダウンメニュー */}
                        {showSettings && (
                            <SettingsDropdown 
                                darkMode={theme}
                                onThemeChange={handleThemeChange}
                                listPosition={listPosition}
                                onListPositionChange={handleListPositionChange}
                                onClose={handleCloseSettings}
                                animationId="settings-menu"
                                getAnimationClass={getAnimationClass}
                                triggerClickAnimation={triggerClickAnimation}
                                triggerSlideFadeInAnimation={triggerSlideFadeInAnimation}
                                isAnimating={isSettingsAnimating}
                                setIsAnimating={setIsSettingsAnimating}
                            />
                        )}
                    </div>
                </div>
            </header>

            {isLoading && 
                <div className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded mb-1 animate-pulse">
                    ファイルを読み込み中...
                </div>
            }
            {error && 
                <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded mb-1 animate-shake">
                    {error}
                </div>
            }

            {sourceData && targetData ? (
                <main className="flex-1 overflow-hidden flex flex-col h-full animate-fade-in">
                    <div className={`flex h-full gap-4 ${listPosition === 'left' ? 'flex-row-reverse' : ''} transition-all duration-300`}>
                        {/* 左側: 翻訳編集エリア */}
                        <TranslationEditor 
                            selectedKey={selectedKey}
                            sourceData={sourceData}
                            editedValue={editedValue}
                            onEditedValueChange={setEditedValue}
                            onUpdateTranslation={handleUpdateTranslation}
                            onCopyAllSourceTexts={handleCopyAllSourceTexts}
                            onCopyCurrentKeySource={handleCopyCurrentKeySource}
                            searchTerm={searchTerm}
                            isRegexSearch={isRegexSearch}
                            isReplaceMode={isReplaceMode}
                            replaceInfo={replaceInfo}
                            onApplyReplacement={handleApplyReplacement}
                            onSkipReplacement={handleSkipReplacement}
                            onCancelReplacement={cancelReplacement}
                        />
                        
                        {/* 右側: 翻訳キーリスト */}
                        <TranslationList 
                            sourceData={sourceData}
                            targetData={targetData}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterType={filterType}
                            onFilterChange={handleFilterChange}
                            filteredKeys={filteredKeys}
                            selectedKey={selectedKey}
                            onSelectKey={handleSelectKey}
                            onDownload={handleDownload}
                            progress={calculateProgress()}
                            onReplaceAll={handleReplaceAll}
                            onReplaceWithConfirmation={handleReplaceWithConfirmation}
                            isReplaceMode={isReplaceMode}
                            fileFormat={fileFormat}
                            onFormatChange={handleFormatChange}
                            isRegexSearch={isRegexSearch}
                            setIsRegexSearch={setIsRegexSearch}
                            sortOrder={sortOrder}
                            onSortChange={handleSortChange}
                        />
                    </div>
                </main>
            ) : (
                <>
                <div className="flex justify-center items-center h-[60vh] text-lg text-gray-500 dark:text-gray-400 animate-fade-in">
                    翻訳元と翻訳先のJSONまたは.langファイルを選択してください。
                </div>
                </>
            )}
        </div>
    );
}

export default EditPage;