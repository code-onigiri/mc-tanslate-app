import { useState, useEffect } from 'react';
import type { LanguageData } from '../util/load/fileloader';
import type { FilterType } from '../edit_page/edit';

export function useTranslationFilters(
  sourceData: LanguageData | null,
  targetData: LanguageData | null,
  searchTerm: string,
  filterType: FilterType,
  isRegexSearch: boolean = false
) {
  const [filteredKeys, setFilteredKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!sourceData || !targetData) {
      setFilteredKeys([]);
      return;
    }
    
    // 全てのソースキーから始める
    let keys = Object.keys(sourceData);
    
    // 翻訳状態によるフィルタリング
    if (filterType === 'translated') {
      keys = keys.filter(key => key in targetData);
    } else if (filterType === 'untranslated') {
      keys = keys.filter(key => !(key in targetData));
    }
    
    // 検索ワードによるフィルタリング（常に適用）
    if (searchTerm.trim() !== '') {
      if (isRegexSearch) {
        try {
          const regex = new RegExp(searchTerm);
          keys = keys.filter(key => 
            regex.test(key) || 
            regex.test(sourceData[key]) ||
            (key in targetData && regex.test(targetData[key]))
          );
        } catch (error) {
          // 正規表現エラーの場合は空配列を返す
          keys = [];
        }
      } else {
        const searchLower = searchTerm.toLowerCase();
        keys = keys.filter(key => 
          key.toLowerCase().includes(searchLower) || 
          sourceData[key].toLowerCase().includes(searchLower) ||
          (key in targetData && targetData[key].toLowerCase().includes(searchLower))
        );
      }
    }
    
    setFilteredKeys(keys);
  }, [sourceData, targetData, searchTerm, filterType, isRegexSearch]);

  return filteredKeys;
}