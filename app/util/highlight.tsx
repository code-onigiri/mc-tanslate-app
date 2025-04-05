import React from 'react';

/**
 * テキスト内の検索語を強調表示するためのユーティリティ
 * @param text 対象のテキスト
 * @param searchTerm 検索語
 * @param highlightClass 強調表示用のCSS クラス
 * @returns React要素
 */
export function highlightText(
  text: string, 
  searchTerm: string, 
  highlightClass: string = 'bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-yellow-100'
): React.ReactElement {
  // テキストが存在しない場合は空のテキストを返す
  if (!text) {
    return <span></span>;
  }
  
  // 検索語が空の場合はテキスト全体を返す
  if (!searchTerm || searchTerm.trim() === '') {
    return <span>{text}</span>;
  }

  try {
    // 検索語を正規表現エスケープして、大文字小文字を区別しない検索を行う
    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    
    // テキストを検索語で分割
    const segments = text.split(regex);

    // 分割されたテキストを表示。検索語にマッチする部分だけハイライト
    return (
      <span>
        {segments.map((segment, i) => {
          // 検索語と一致する部分かどうかチェック (大文字/小文字の違いを考慮)
          if (segment.toLowerCase() === searchTerm.toLowerCase()) {
            return (
              <span key={i} className={highlightClass}>
                {segment}
              </span>
            );
          }
          // 一致しない部分はそのまま表示
          return <span key={i}>{segment}</span>;
        })}
      </span>
    );
  } catch (error) {
    // エラーが発生した場合は元のテキストをそのまま返す
    console.error('検索語のハイライト処理に失敗しました:', error);
    return <span>{text}</span>;
  }
}

/**
 * 正規表現に一致するテキストを強調表示するためのユーティリティ
 * @param text 対象のテキスト
 * @param regexPattern 正規表現のパターン文字列
 * @param highlightClass 強調表示用のCSS クラス
 * @returns React要素
 */
export function highlightRegexMatches(
  text: string,
  regexPattern: string,
  highlightClass: string = 'bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-yellow-100'
): React.ReactElement {
  if (!text) {
    return <span></span>;
  }
  
  if (!regexPattern || regexPattern.trim() === '') {
    return <span>{text}</span>;
  }

  try {
    const regex = new RegExp(`(${regexPattern})`, 'g');
    
    // 正規表現で一致した部分と一致していない部分に分割
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // 一致箇所の前にある非一致テキストを追加
      if (match.index > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, match.index),
          highlight: false
        });
      }
      
      // 一致箇所を追加
      parts.push({
        text: match[0],
        highlight: true
      });
      
      lastIndex = match.index + match[0].length;
      
      // 無限ループを防止
      if (match[0].length === 0) {
        regex.lastIndex += 1;
      }
    }
    
    // 最後の一致箇所以降のテキストを追加
    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        highlight: false
      });
    }
    
    return (
      <span>
        {parts.map((part, i) => (
          part.highlight ? (
            <span key={i} className={highlightClass}>
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        ))}
      </span>
    );
  } catch (error) {
    // エラーが発生した場合は元のテキストをそのまま返す
    console.error('正規表現のハイライト処理に失敗しました:', error);
    return <span>{text}</span>;
  }
}
