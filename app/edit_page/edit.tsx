import { useState, useEffect } from 'react';
import { FileUploader } from '../components/FileUploader';
import { TranslationEditor } from '../components/TranslationEditor';
import { TranslationList } from '../components/TranslationList';
import { loadLanguageData, saveLanguageData, type LanguageData } from '../util/load/fileloader';
import { useTranslationFilters } from '../hooks/useTranslationFilters';

// フィルタータイプの定義
export type FilterType = 'all' | 'translated' | 'untranslated';

function EditPage() {
    // 状態管理
    const [sourceData, setSourceData] = useState<LanguageData | null>(null);
    const [targetData, setTargetData] = useState<LanguageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState('');
    // フィルタータイプの状態
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [targetFileName, setTargetFileName] = useState<string | null>(null);
    // ファイル形式の状態
    const [fileFormat, setFileFormat] = useState<'json' | 'lang'>('json');
    
    // 置換の状態管理
    const [isReplaceMode, setIsReplaceMode] = useState(false);
    const [replaceInfo, setReplaceInfo] = useState<{
        keys: string[];
        currentIndex: number;
        searchText: string;
        replaceText: string;
        total: number;
    } | null>(null);

    // フィルタリングロジックをカスタムフックに委譲
    const filteredKeys = useTranslationFilters(sourceData, targetData, searchTerm, filterType);

    // ソース言語ファイル（翻訳元）を読み込む
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

    // ターゲット言語ファイル（翻訳先）を読み込む
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

    // キーを選択したときの処理
    const handleSelectKey = (key: string) => {
        setSelectedKey(key);
        // 翻訳先データに既存の値があればそれを使用、なければ空文字を使用
        setEditedValue(targetData && key in targetData ? targetData[key] : '');
    };

    // 翻訳を更新する処理
    const handleUpdateTranslation = () => {
        if (!selectedKey || !targetData) return;
        
        // 新しいtargetDataオブジェクトを作成して更新
        const updatedTargetData = {
            ...targetData,
            [selectedKey]: editedValue
        };
        
        setTargetData(updatedTargetData);
    };

    // すべての翻訳元テキストを翻訳先にコピーする
    const handleCopyAllSourceTexts = () => {
        if (!sourceData || !targetData) return;
        
        // 翻訳元のすべてのキーとテキストを翻訳先にコピー
        const updatedTargetData = { ...targetData };
        
        Object.keys(sourceData).forEach(key => {
            updatedTargetData[key] = sourceData[key];
        });
        
        setTargetData(updatedTargetData);
        
        // 現在選択中のキーの値も更新
        if (selectedKey) {
            setEditedValue(sourceData[selectedKey]);
        }
    };

    // 現在選択中のキーの翻訳元テキストをコピーする
    const handleCopyCurrentKeySource = () => {
        if (!sourceData || !targetData || !selectedKey) return;
        
        // 選択中のキーの翻訳元テキストを翻訳先にコピー
        const updatedTargetData = {
            ...targetData,
            [selectedKey]: sourceData[selectedKey]
        };
        
        setTargetData(updatedTargetData);
        setEditedValue(sourceData[selectedKey]);
    };

    // フィルターを変更する処理
    const handleFilterChange = (newFilter: FilterType) => {
        setFilterType(newFilter);
    };

    // 新規翻訳ファイルを作成
    const handleCreateNewTarget = (format: 'json' | 'lang' = 'json') => {
        // 空のオブジェクトを新規ターゲットデータとして設定
        setTargetData({});
        // デフォルトの新規ファイル名を設定（フォーマットに基づく）
        setTargetFileName(format === 'json' ? 'ja_jp.json' : 'ja_jp.lang');
        // ファイル形式を設定
        setFileFormat(format);
    };

    // ファイル形式を変更する処理
    const handleFormatChange = (format: 'json' | 'lang') => {
        setFileFormat(format);
        // ファイル名の拡張子も対応するものに変更
        if (targetFileName) {
            const baseName = targetFileName.split('.')[0];
            setTargetFileName(`${baseName}.${format}`);
        }
    };

    // JSONをダウンロードする処理
    const handleDownload = () => {
        if (!targetData) return;
        
        // 既存のファイル名からベース名を取得するか、デフォルト名を使用
        const baseName = targetFileName 
            ? targetFileName.split('.')[0] 
            : 'ja_jp';
        
        // ファイル形式に応じた拡張子を使用
        const fileName = `${baseName}.${fileFormat}`;
        
        // 保存処理を実行
        saveLanguageData(targetData, fileFormat, fileName);
    };

    // 進捗率の計算
    const calculateProgress = (): number => {
        if (!sourceData || !targetData) return 0;
        const totalKeys = Object.keys(sourceData).length;
        if (totalKeys === 0) return 0;
        const translatedKeys = Object.keys(sourceData).filter(key => key in targetData).length;
        return Math.round((translatedKeys / totalKeys) * 100);
    };

    // 一括置換処理
    const handleReplaceAll = (searchText: string, replaceText: string) => {
        if (!targetData || !searchText || !replaceText) return;
        
        // 新しいtargetDataオブジェクトを作成して更新
        const updatedTargetData = { ...targetData };
        let replacementCount = 0;
        
        // 検索対象のキーに対して置換を実行
        filteredKeys.forEach(key => {
            if (key in updatedTargetData) {
                const value = updatedTargetData[key];
                if (value.includes(searchText)) {
                    updatedTargetData[key] = value.split(searchText).join(replaceText);
                    replacementCount++;
                }
            }
        });
        
        setTargetData(updatedTargetData);
        
        // 現在選択中のキーの値も更新
        if (selectedKey && selectedKey in updatedTargetData) {
            setEditedValue(updatedTargetData[selectedKey]);
        }
        
        alert(`${replacementCount}箇所の置換が完了しました。`);
    };

    // 確認しながら置換
    const handleReplaceWithConfirmation = (searchText: string, replaceText: string) => {
        if (!targetData || !searchText || !replaceText) return;
        
        // 置換対象のキーを見つける
        const keysToReplace = filteredKeys.filter(key => {
            return key in targetData && targetData[key].includes(searchText);
        });
        
        if (keysToReplace.length === 0) {
            alert('置換対象が見つかりませんでした。');
            return;
        }
        
        // 置換情報を設定
        setReplaceInfo({
            keys: keysToReplace,
            currentIndex: 0,
            searchText,
            replaceText,
            total: keysToReplace.length
        });
        
        // 最初のキーを選択して編集画面で開く（少し遅延してスクロールが確実に動作するようにする）
        setTimeout(() => {
            handleSelectKey(keysToReplace[0]);
        }, 50);
        
        // 置換モードをアクティブに
        setIsReplaceMode(true);
    };

    // 次の置換項目に進む
    const handleNextReplacement = () => {
        if (!replaceInfo || !targetData) return;
        
        const { keys, currentIndex, searchText, replaceText } = replaceInfo;
        
        // 次のインデックスを計算
        const nextIndex = currentIndex + 1;
        
        // すべての置換が完了した場合
        if (nextIndex >= keys.length) {
            alert('すべての置換が完了しました。');
            setIsReplaceMode(false);
            setReplaceInfo(null);
            return;
        }
        
        // 次のキーに進む
        setReplaceInfo({
            ...replaceInfo,
            currentIndex: nextIndex
        });
        
        // 次のキーを選択して編集画面で開く（少し遅延してスクロールが確実に動作するようにする）
        setTimeout(() => {
            handleSelectKey(keys[nextIndex]);
        }, 50);
    };

    // 置換を適用
    const handleApplyReplacement = () => {
        if (!replaceInfo || !targetData || !selectedKey) return;
        
        const { searchText, replaceText } = replaceInfo;
        
        // 現在選択中のキーの値を取得
        const oldValue = targetData[selectedKey];
        
        // 置換を実行
        const newValue = oldValue.split(searchText).join(replaceText);
        
        // データを更新
        const updatedTargetData = {
            ...targetData,
            [selectedKey]: newValue
        };
        
        setTargetData(updatedTargetData);
        
        // エディタの値も更新
        setEditedValue(newValue);
        
        // 次の置換項目へ進む
        handleNextReplacement();
    };

    // 現在の置換をスキップ
    const handleSkipReplacement = () => {
        handleNextReplacement();
    };

    // 置換モードをキャンセル
    const handleCancelReplacement = () => {
        setIsReplaceMode(false);
        setReplaceInfo(null);
    };

    return (
        <div className="flex flex-col h-screen p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="mb-1">
                <h1 className="text-2xl font-bold mb-1">Minecraft 翻訳エディタ</h1>
                <FileUploader 
                    onSourceFileSelect={handleSourceFileChange}
                    onTargetFileSelect={handleTargetFileChange}
                    onCreateNewTarget={() => handleCreateNewTarget(fileFormat)}
                    isLoading={isLoading}
                    selectedTargetFileName={targetFileName}
                    onFormatChange={handleFormatChange}
                    fileFormat={fileFormat}
                />
            </header>

            {isLoading && <div className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded mb-1">ファイルを読み込み中...</div>}
            {error && <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded mb-1">{error}</div>}

            {sourceData && targetData ? (
                <main className="flex-1 overflow-hidden flex flex-col h-full">
                    <div className="flex h-full gap-4">
                        {/* 左側: 翻訳編集エリア - 置換確認UIを追加 */}
                        <TranslationEditor 
                            selectedKey={selectedKey}
                            sourceData={sourceData}
                            editedValue={editedValue}
                            onEditedValueChange={setEditedValue}
                            onUpdateTranslation={handleUpdateTranslation}
                            onCopyAllSourceTexts={handleCopyAllSourceTexts}
                            onCopyCurrentKeySource={handleCopyCurrentKeySource}
                            searchTerm={searchTerm}
                            // 置換モード関連のプロパティ
                            isReplaceMode={isReplaceMode}
                            replaceInfo={replaceInfo}
                            onApplyReplacement={handleApplyReplacement}
                            onSkipReplacement={handleSkipReplacement}
                            onCancelReplacement={handleCancelReplacement}
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
                        />
                    </div>
                </main>
            ) : (
                <div className="flex justify-center items-center h-[60vh] text-lg text-gray-500 dark:text-gray-400">
                    翻訳元と翻訳先のJSONまたは.langファイルを選択してください。
                </div>
            )}
        </div>
    );
}

export default EditPage;