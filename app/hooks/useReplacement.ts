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
  startReplacement: (searchText: string, replaceText: string, filteredKeys: string[], targetData: LanguageData, isRegex: boolean) => string | null;
  replaceAll: (searchText: string, replaceText: string, filteredKeys: string[], targetData: LanguageData, isRegex: boolean) => LanguageData;
  applyCurrentReplacement: (targetData: LanguageData, selectedKey: string, isRegex: boolean) => { updatedData: LanguageData, newValue: string };
  skipCurrentReplacement: () => string | null;
  getCurrentReplacementKey: () => string | null;
  cancelReplacement: () => void;
  showContinueConfirmation: boolean;
  setShowContinueConfirmation: (show: boolean) => void;
  continueToNextReplacement: () => string | null;
  stopReplacement: () => void;
}

/**
 * 置換機能のためのカスタムフック
 */
export function useReplacement(): UseReplacementReturn {
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [replaceInfo, setReplaceInfo] = useState<ReplacementInfo | null>(null);
  const [showContinueConfirmation, setShowContinueConfirmation] = useState(false);

  // 現在の置換キーを取得
  const getCurrentReplacementKey = (): string | null => {
    if (!replaceInfo || replaceInfo.currentIndex >= replaceInfo.keys.length) {
      return null;
    }
    return replaceInfo.keys[replaceInfo.currentIndex];
  };

  // 置換作業を開始する
  const startReplacement = (
    searchText: string, 
    replaceText: string, 
    filteredKeys: string[], 
    targetData: LanguageData,
    isRegex: boolean
  ): string | null => {
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
      return null;
    }
    
    setReplaceInfo({
      keys: keysToReplace,
      currentIndex: 0,
      searchText,
      replaceText,
      total: keysToReplace.length
    });
    
    setIsReplaceMode(true);
    
    return keysToReplace[0] || null;
  };

  // 一括置換を実行
  const replaceAll = (
    searchText: string, 
    replaceText: string, 
    filteredKeys: string[], 
    targetData: LanguageData,
    isRegex: boolean
  ): LanguageData => {
    const updatedTargetData = { ...targetData };
    let replacementCount = 0;
    
    filteredKeys.forEach(key => {
      if (key in updatedTargetData) {
        const value = updatedTargetData[key];
        
        if (isRegex) {
          try {
            const regex = new RegExp(searchText, 'g');
            if (regex.test(value)) {
              updatedTargetData[key] = value.replace(regex, replaceText);
              replacementCount++;
            }
          } catch (error) {
          }
        } else {
          if (value.includes(searchText)) {
            updatedTargetData[key] = value.split(searchText).join(replaceText);
            replacementCount++;
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
    
    const updatedData = {
      ...targetData,
      [selectedKey]: newValue
    };

    if (replaceInfo.currentIndex < replaceInfo.keys.length - 1) {
      setShowContinueConfirmation(true);
    } else {
      alert('すべての置換が完了しました。');
      setIsReplaceMode(false);
      setReplaceInfo(null);
    }
    
    return { updatedData, newValue };
  };

  // 次の置換項目に進む
  const nextReplacement = (): string | null => {
    if (!replaceInfo) return null;
    
    const { keys, currentIndex } = replaceInfo;
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= keys.length) {
      alert('すべての置換が完了しました。');
      setIsReplaceMode(false);
      setReplaceInfo(null);
      return null;
    }
    
    setReplaceInfo({
      ...replaceInfo,
      currentIndex: nextIndex
    });
    
    return keys[nextIndex] || null;
  };

  // 現在の置換をスキップ
  const skipCurrentReplacement = (): string | null => {
    setShowContinueConfirmation(true);
    return null;
  };

  // 確認後に次の置換に進む
  const continueToNextReplacement = (): string | null => {
    setShowContinueConfirmation(false);
    return nextReplacement();
  };

  // 確認後に置換を終了
  const stopReplacement = (): void => {
    setShowContinueConfirmation(false);
    setIsReplaceMode(false);
    setReplaceInfo(null);
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
    getCurrentReplacementKey,
    cancelReplacement,
    showContinueConfirmation,
    setShowContinueConfirmation,
    continueToNextReplacement,
    stopReplacement
  };
}
