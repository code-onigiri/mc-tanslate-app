export type LanguageData = {
  [key: string]: string;
};

/**
 * ファイルの拡張子を取得する
 * @param file ファイル
 * @returns 拡張子（小文字）
 */
function getFileExtension(file: File): string {
  return file.name.split('.').pop()?.toLowerCase() || '';
}

/**
 * JSONファイルからデータを読み込む
 * @param text JSONファイルのテキスト内容
 * @returns 言語データ（キーと値のオブジェクト）
 */
function parseJsonData(text: string): LanguageData {
  try {
    const data = JSON.parse(text);
    return data as LanguageData;
  } catch (error) {
    console.error('JSONファイルの解析に失敗しました:', error);
    throw new Error(`JSONファイルの解析に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * .langファイルからデータを読み込む
 * 形式: key=value (それ以外の行はコメントとして無視)
 * @param text .langファイルのテキスト内容
 * @returns 言語データ（キーと値のオブジェクト）
 */
function parseLangData(text: string): LanguageData {
  const result: LanguageData = {};
  
  // 行ごとに処理
  const lines = text.split(/\r?\n/);
  
  for (const line of lines) {
    // コメント行や空行をスキップ
    if (!line.trim() || !line.includes('=')) {
      continue;
    }
    
    // key=value の形式に一致する行のみ処理
    const separatorIndex = line.indexOf('=');
    if (separatorIndex > 0) {
      const key = line.substring(0, separatorIndex).trim();
      const value = line.substring(separatorIndex + 1).trim();
      
      if (key) {
        result[key] = value;
      }
    }
  }
  
  return result;
}

/**
 * 言語ファイルからデータを読み込む（JSONと.langをサポート）
 * @param file 言語ファイル
 * @returns 言語データ（キーと値のオブジェクト）
 */
export async function loadLanguageData(file: File): Promise<LanguageData> {
  try {
    const text = await file.text();
    const extension = getFileExtension(file);
    
    // ファイル形式に応じたパーサーを選択
    switch (extension) {
      case 'json':
        return parseJsonData(text);
      case 'lang':
        return parseLangData(text);
      default:
        throw new Error(`サポートされていないファイル形式です: ${extension}。JSONまたは.langファイルを使用してください。`);
    }
  } catch (error) {
    console.error('言語データの読み込みに失敗しました:', error);
    throw new Error(`ファイルの解析に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 言語データをファイルとして保存
 * @param data 言語データ
 * @param format 保存形式 ('json' または 'lang')
 * @param filename ファイル名（デフォルト: 'translation.json'または'translation.lang'）
 */
export function saveLanguageData(
  data: LanguageData, 
  format: 'json' | 'lang' = 'json', 
  filename: string = format === 'json' ? 'translation.json' : 'translation.lang'
): void {
  let content: string;
  let mimeType: string;
  
  if (format === 'json') {
    // JSONとして保存
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
  } else {
    // .lang形式として保存
    content = Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    mimeType = 'text/plain';
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
