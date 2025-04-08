import { useFileOperations } from './hooks/useFileOperations';
import { useSettings } from './hooks/useSettings';
import { useProjectOperations } from './hooks/useProjectOperations';
import { useTranslationOperations } from './hooks/useTranslationOperations';
import { useUIInteractions } from './hooks/useUIInteractions';
import { TranslationEditor } from '../components/TranslationEditor';
import { TranslationList } from '../components/TranslationList';
import { SettingsDropdown } from '../components/SettingsDropdown';
import { HamburgerMenu } from '../components/HamburgerMenu';
import { ErrorBoundary } from '../components/ErrorBoundary';
import type { FilterType } from './types';

function EditPage() {
    // ファイル操作に関連するフック
    const fileOps = useFileOperations();
    
    // 設定関連のフック
    const settings = useSettings();
    
    // 翻訳操作関連のフック
    const translationOps = useTranslationOperations(
        fileOps.sourceData,
        fileOps.targetData,
        fileOps.setTargetData
    );
    
    // プロジェクト操作関連のフック
    const projectOps = useProjectOperations(
        fileOps.sourceData,
        fileOps.setSourceData,
        fileOps.targetData,
        fileOps.setTargetData,
        fileOps.fileFormat,
        fileOps.handleFormatChange,
        fileOps.targetFileName,
        setTargetFileName => fileOps.targetFileName = setTargetFileName,
        setIsLoading => fileOps.isLoading = setIsLoading,
        setError => fileOps.error = setError
    );
    
    // UI操作関連のフック
    const uiInteractions = useUIInteractions();

    return (
        <ErrorBoundary
            onError={uiInteractions.handleEditPageError}
            fallback={(error, resetError) => (
                <div className="flex flex-col h-screen p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                    <div className="border border-red-500 rounded-md bg-red-50 dark:bg-red-900/20 p-6 m-auto max-w-2xl w-full relative">
                        <div className="absolute top-2 right-2">
                            <button
                                onClick={resetError}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                                aria-label="閉じる"
                            >
                                ☓
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
                            翻訳エディタでエラーが発生しました
                        </h1>
                        <p className="text-red-600 dark:text-red-400 mb-4">
                            {error.message}
                        </p>
                        <details className="mb-6 cursor-pointer">
                            <summary className="font-medium text-red-600 dark:text-red-400">詳細情報</summary>
                            <pre className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-800 text-sm overflow-auto">
                                {error.stack}
                            </pre>
                        </details>
                        <div className="flex justify-end">
                            <button
                                onClick={resetError}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            >
                                エディタを再読み込み
                            </button>
                        </div>
                    </div>
                </div>
            )}
        >
            <div className="flex flex-col h-screen p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <header className="mb-1 relative">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-3">
                            {/* ハンバーガーメニュー（ファイルアップローダーを含む） - 左側に配置 */}
                            <HamburgerMenu
                                onSourceFileSelect={fileOps.handleSourceFileChange}
                                onTargetFileSelect={fileOps.handleTargetFileChange}
                                onCreateNewTarget={() => fileOps.handleCreateNewTarget(fileOps.fileFormat)}
                                isLoading={fileOps.isLoading}
                                selectedTargetFileName={fileOps.targetFileName}
                                fileFormat={fileOps.fileFormat}
                                onFormatChange={fileOps.handleFormatChange}
                                triggerClickAnimation={settings.triggerClickAnimation}
                                triggerSlideFadeOutAnimation={settings.triggerSlideFadeOutAnimation}
                                triggerSlideFadeInAnimation={settings.triggerSlideFadeInAnimation}
                                getAnimationClass={settings.getAnimationClass}
                                onProjectExport={projectOps.handleProjectExport}
                                onProjectImport={projectOps.handleProjectImport}
                            />
                            
                            <h1 className="text-2xl font-bold animate-fade-in ml-2">Minecraft 翻訳エディタ</h1>
                        </div>
                        
                        {/* 設定ボタン - 右側に配置 */}
                        <div className="relative" ref={settings.settingsRef}>
                            <button
                                onClick={settings.handleOpenSettings}
                                className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${settings.getAnimationClass('settings-button')}`}
                                aria-label="設定"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            
                            {/* 設定ドロップダウンメニュー */}
                            {settings.showSettings && (
                                <SettingsDropdown 
                                    darkMode={settings.theme}
                                    onThemeChange={settings.handleThemeChange}
                                    listPosition={settings.listPosition}
                                    onListPositionChange={settings.handleListPositionChange}
                                    onClose={settings.handleCloseSettings}
                                    animationId="settings-menu"
                                    getAnimationClass={settings.getAnimationClass}
                                    triggerClickAnimation={settings.triggerClickAnimation}
                                    triggerSlideFadeInAnimation={settings.triggerSlideFadeInAnimation}
                                    isAnimating={settings.isSettingsAnimating}
                                    setIsAnimating={settings.setIsSettingsAnimating}
                                />
                            )}
                        </div>
                    </div>
                </header>

                {fileOps.isLoading && 
                    <div className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded mb-1 animate-pulse">
                        ファイルを読み込み中...
                    </div>
                }
                {fileOps.error && 
                    <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded mb-1 animate-shake relative">
                        <button 
                            onClick={() => fileOps.setError(null)} 
                            className="absolute top-1 right-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                            aria-label="閉じる"
                        >
                            ☓
                        </button>
                        {fileOps.error}
                    </div>
                }

                {fileOps.sourceData && fileOps.targetData ? (
                    <main className="flex-1 overflow-hidden flex flex-col h-full animate-fade-in">
                        <div className={`flex h-full gap-4 ${settings.listPosition === 'left' ? 'flex-row-reverse' : ''} transition-all duration-300`}>
                            {/* 左側: 翻訳編集エリア */}
                            <TranslationEditor 
                                selectedKey={translationOps.selectedKey}
                                sourceData={fileOps.sourceData}
                                editedValue={translationOps.editedValue}
                                onEditedValueChange={translationOps.setEditedValue}
                                onUpdateTranslation={translationOps.handleUpdateTranslation}
                                onCopyAllSourceTexts={translationOps.handleCopyAllSourceTexts}
                                onCopyCurrentKeySource={translationOps.handleCopyCurrentKeySource}
                                searchTerm={translationOps.searchTerm}
                                isRegexSearch={translationOps.isRegexSearch}
                            />
                            
                            {/* 右側: 翻訳キーリスト */}
                            <TranslationList 
                                sourceData={fileOps.sourceData}
                                targetData={fileOps.targetData}
                                searchTerm={translationOps.searchTerm}
                                setSearchTerm={translationOps.setSearchTerm}
                                filterType={translationOps.filterType}
                                onFilterChange={translationOps.handleFilterChange}
                                filteredKeys={translationOps.filteredKeys}
                                selectedKey={translationOps.selectedKey}
                                onSelectKey={translationOps.handleSelectKey}
                                onDownload={fileOps.handleDownload}
                                progress={translationOps.calculateProgress()}
                                fileFormat={fileOps.fileFormat}
                                onFormatChange={fileOps.handleFormatChange}
                                isRegexSearch={translationOps.isRegexSearch}
                                setIsRegexSearch={translationOps.setIsRegexSearch}
                                sortOrder={translationOps.sortOrder}
                                onSortChange={translationOps.handleSortChange}
                            />
                        </div>
                    </main>
                ) : (
                    <div className="flex justify-center items-center h-[60vh] text-lg text-gray-500 dark:text-gray-400 animate-fade-in">
                        翻訳元と翻訳先のJSONまたは.langファイルを選択してください。
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}

export default EditPage;