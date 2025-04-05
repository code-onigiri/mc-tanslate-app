import { useState } from 'react';
import type { LanguageData } from '../util/load/fileloader';
import { replaceWithRegex } from '../util/regexUtils';

interface ReplacementInfo {
  keys: string[];
  currentIndex: number;
  searchText: string;
  replaceText: string;
  total: number;
}

interface UseReplacementReturn {
  isReplaceMode: boolean;
  replaceInfo: ReplacementInfo | null;
  startReplacement: (searchText: string, replaceText: string, filteredKeys: string[], targetData: LanguageData, isRegex: boolean) => void;
  replaceAll: (searchText: string, replaceText: string, filteredKeys: string[], targetData: LanguageData, isRegex: boolean) => LanguageData;
  applyCurrentReplacement: (targetData: LanguageData, selectedKey: string, isRegex: boolean) => { updatedData: LanguageData, newValue: string };
  skipCurrentReplacement: () => void;
  nextReplacement: () => void;
  cancelReplacement: () => void;
}

/**
 * 置換機能のためのカスタムフック
 */
export function useReplacement(): UseReplacementReturn {
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [replaceInfo, setReplaceInfo] = useState<ReplacementInfo | null>(null);

  // 置換作業を開始する
  const startReplacement = (
    searchText: string, 
    replaceText: string, 
    filteredKeys: string[], 
    targetData: LanguageData,
    isRegex: boolean
  ) => {
    // 置換対象のキーを見つける
    const keysToReplace = filteredKeys.filter(key => {
      if (!(key in targetData)) return false;
      
      if (isRegex) {
        try {
          const regex = new RegExp(searchText);
          return regex.test(targetData[key]);
        } catch (error) {
          return false;
        }
      } else {
        return targetData[key].includes(searchText);
      }
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
    
    // 置換モードをアクティブに
    setIsReplaceMode(true);
  };

  // 一括置換を実行
  const replaceAll = (
    searchText: string, 
    replaceText: string, 
    filteredKeys: string[], 
    targetData: LanguageData,
    isRegex: boolean
  ): LanguageData => {
    // 新しいtargetDataオブジェクトを作成して更新
    const updatedTargetData = { ...targetData };
    
    // 検索対象のキーに対して置換を実行
    filteredKeys.forEach(key => {
      if (key in updatedTargetData) {
        const value = updatedTargetData[key];
        
        if (isRegex) {
          updatedTargetData[key] = replaceWithRegex(value, searchText, replaceText);
        } else {
          if (value.includes(searchText)) {
            updatedTargetData[key] = value.split(searchText).join(replaceText);
          }
        }
      }
    });
    
    return updatedTargetData;
  };

  // 現在の置換項目を適用
  const applyCurrentReplacement = (
    targetData: LanguageData, 
    selectedKey: string, 
    isRegex: boolean
  ): { updatedData: LanguageData, newValue: string } => {
    if (!replaceInfo) {
      return { updatedData: targetData, newValue: targetData[selectedKey] || '' };
    }
    
    const { searchText, replaceText } = replaceInfo;
    const oldValue = targetData[selectedKey];
    let newValue: string;
    
    if (isRegex) {
      newValue = replaceWithRegex(oldValue, searchText, replaceText);
    } else {
      newValue = oldValue.split(searchText).join(replaceText);
    }
    
    // データを更新
    const updatedData = {
      ...targetData,
      [selectedKey]: newValue
    };
    
    // 次の置換項目へ進む
    nextReplacement();
    
    return { updatedData, newValue };
  };

  // 次の置換項目に進む
  const nextReplacement = () => {
    if (!replaceInfo) return;
    
    const { keys, currentIndex } = replaceInfo;
    
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
  };

  // 現在の置換をスキップ
  const skipCurrentReplacement = () => {
    nextReplacement();
  };

  // 置換をキャンセル
  const cancelReplacement = () => {
    setIsReplaceMode(false);
    setReplaceInfo(null);
  };

  return {
    isReplaceMode,
    replaceInfo,
    startReplacement,
    replaceAll,
    applyCurrentReplacement,
    skipCurrentReplacement,
    nextReplacement,
    cancelReplacement
  };
}
