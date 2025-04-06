/**
 * 文字列が有効な内容を持っているかを確認する
 * 空文字列、空白のみの文字列、undefined、nullの場合はfalseを返す
 * 
 * @param str チェックする文字列
 * @returns 文字列が有効な内容を持っている場合はtrue、それ以外はfalse
 */
export function hasContent(str: string | undefined | null): boolean {
  return str !== null && str !== undefined && str.trim() !== '';
}

/**
 * 文字列が空かどうかを確認する (hasContentの反対)
 * 
 * @param str チェックする文字列
 * @returns 文字列が空、空白のみ、undefined、nullの場合はtrue、それ以外はfalse
 */
export function isEmpty(str: string | undefined | null): boolean {
  return !hasContent(str);
}