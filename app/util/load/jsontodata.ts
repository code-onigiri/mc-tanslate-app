export type LanguageData = {
  [key: string]: string;
};

/**
 * JSONファイルから言語データを読み込む
 * @param file JSONファイル
 * @returns 言語データ（キーと値のオブジェクト）
 */
export async function loadLanguageData(file: File): Promise<LanguageData> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    return data as LanguageData;
  } catch (error) {
    console.error('言語データの読み込みに失敗しました:', error);
    throw new Error(`JSONファイルの解析に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 言語データをJSONファイルとして保存
 * @param data 言語データ
 * @param filename ファイル名
 */
export function saveLanguageData(data: LanguageData, filename: string = 'translation.json'): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}