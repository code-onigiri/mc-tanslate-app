/**
 * 正規表現の検証を行う
 * @param pattern 検証する正規表現パターン
 * @returns エラーメッセージ（問題なければnull）
 */
export function validateRegex(pattern: string): string | null {
  if (!pattern) return null;
  
  try {
    new RegExp(pattern);
    return null;
  } catch (error) {
    return `正規表現エラー: ${(error as Error).message}`;
  }
}

/**
 * 文字列を正規表現で検索し、一致するかどうかをチェックする
 * @param text 検索対象テキスト
 * @param pattern 正規表現パターン
 * @returns 一致する場合はtrue
 */
export function testRegex(text: string, pattern: string): boolean {
  try {
    const regex = new RegExp(pattern);
    return regex.test(text);
  } catch (error) {
    return false;
  }
}

/**
 * 正規表現で文字列を置換する
 * @param text 置換対象テキスト
 * @param pattern 正規表現パターン
 * @param replacement 置換テキスト
 * @returns 置換後のテキスト
 */
export function replaceWithRegex(text: string, pattern: string, replacement: string): string {
  try {
    const regex = new RegExp(pattern, 'g');
    return text.replace(regex, replacement);
  } catch (error) {
    return text; // エラーの場合は元のテキストを返す
  }
}
