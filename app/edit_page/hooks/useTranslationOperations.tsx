import { useState } from 'react';
import type { LanguageData } from '../../util/load/fileloader';
import type { FilterType } from '../types';
import type { SortOrder } from '../../components/TranslationFilters';
import { useTranslationFilters } from '../../hooks/useTranslationFilters';

/**
 * 翻訳データの操作に関連する機能を提供するカスタムフック
 */
export const useTranslationOperations = (
    sourceData: LanguageData | null,
    targetData: LanguageData | null,
    setTargetData: (data: LanguageData) => void
) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [isRegexSearch, setIsRegexSearch] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOrder>('none');

    // フィルタリングロジック
    const filteredKeys = useTranslationFilters(
        sourceData, 
        targetData, 
        searchTerm, 
        filterType, 
        isRegexSearch,
        sortOrder
    );

    /**
     * キーを選択する
     */
    const handleSelectKey = (key: string) => {
        setSelectedKey(key);
        setEditedValue(targetData && key in targetData ? targetData[key] : '');
    };

    /**
     * 翻訳を更新する
     */
    const handleUpdateTranslation = () => {
        if (!selectedKey || !targetData) return;
        
        const updatedTargetData = {
            ...targetData,
            [selectedKey]: editedValue
        };
        
        setTargetData(updatedTargetData);
    };

    /**
     * 全ソーステキストをコピーする
     */
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

    /**
     * 現在のキーのソーステキストをコピーする
     */
    const handleCopyCurrentKeySource = () => {
        if (!sourceData || !targetData || !selectedKey) return;
        
        const updatedTargetData = {
            ...targetData,
            [selectedKey]: sourceData[selectedKey]
        };
        
        setTargetData(updatedTargetData);
        setEditedValue(sourceData[selectedKey]);
    };

    /**
     * フィルターを変更する
     */
    const handleFilterChange = (newFilter: FilterType) => {
        setFilterType(newFilter);
    };

    /**
     * ソート順を変更する
     */
    const handleSortChange = (newSortOrder: SortOrder) => {
        setSortOrder(newSortOrder);
    };

    /**
     * 進捗率を計算する
     */
    const calculateProgress = (): number => {
        if (!sourceData || !targetData) return 0;
        const totalKeys = Object.keys(sourceData).length;
        if (totalKeys === 0) return 0;
        const translatedKeys = Object.keys(sourceData).filter(key => key in targetData).length;
        return Math.round((translatedKeys / totalKeys) * 100);
    };

    return {
        searchTerm,
        setSearchTerm,
        selectedKey,
        setSelectedKey,
        editedValue,
        setEditedValue,
        filterType,
        setFilterType,
        isRegexSearch,
        setIsRegexSearch,
        sortOrder,
        setSortOrder,
        filteredKeys,
        handleSelectKey,
        handleUpdateTranslation,
        handleCopyAllSourceTexts,
        handleCopyCurrentKeySource,
        handleFilterChange,
        handleSortChange,
        calculateProgress
    };
};
