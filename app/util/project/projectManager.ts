import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { type LanguageData, loadLanguageData } from '../load/fileloader';

/**
 * プロジェクトファイル（.mcta）をエクスポートする
 * @param sourceData 翻訳元データ
 * @param targetData 翻訳先データ
 * @param sourceFormat 翻訳元のファイル形式（'json' | 'lang'）
 * @param targetFormat 翻訳先のファイル形式（'json' | 'lang'）
 * @param filename エクスポートするファイル名（拡張子.mctaは自動付与）
 */
export async function exportProject(
  sourceData: LanguageData,
  targetData: LanguageData,
  sourceFormat: 'json' | 'lang',
  targetFormat: 'json' | 'lang',
  filename: string = 'minecraft_translation_project'
): Promise<void> {
  try {
    const zip = new JSZip();

    // ファイル名を設定
    const sourceFilename = `source.${sourceFormat}`;
    const targetFilename = `target.${targetFormat}`;

    // データをJSON文字列またはlang形式に変換
    const sourceContent = formatContent(sourceData, sourceFormat);
    const targetContent = formatContent(targetData, targetFormat);

    // ZIPファイルにデータを追加
    zip.file(sourceFilename, sourceContent);
    zip.file(targetFilename, targetContent);

    // メタデータを追加
    const metaData = {
      version: '1.0',
      created: new Date().toISOString(),
      sourceFormat,
      targetFormat
    };
    zip.file('meta.json', JSON.stringify(metaData, null, 2));

    // ZIPファイルを生成
    const content = await zip.generateAsync({ type: 'blob' });

    // ファイル名が.mctaで終わっていなければ追加
    const fullFilename = filename.endsWith('.mcta') ? filename : `${filename}.mcta`;

    // ダウンロード
    saveAs(content, fullFilename);
  } catch (error) {
    console.error('プロジェクトのエクスポート中にエラーが発生しました:', error);
    throw new Error(`${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * プロジェクトファイル（.mcta）をインポートする
 * @param file インポートするプロジェクトファイル（.mcta）
 * @returns 翻訳元データと翻訳先データ、およびそれぞれのファイル形式
 */
export async function importProject(file: File): Promise<{
  sourceData: LanguageData;
  targetData: LanguageData;
  sourceFormat: 'json' | 'lang';
  targetFormat: 'json' | 'lang';
}> {
  try {
    // ファイル拡張子の確認
    if (!file.name.toLowerCase().endsWith('.mcta')) {
      throw new Error('プロジェクトファイルは.mcta形式である必要があります');
    }

    // ZIPファイルを読み込み
    const zip = new JSZip();
    const content = await zip.loadAsync(file);

    // メタデータを読み込み
    let metaData = { sourceFormat: 'json', targetFormat: 'json' } as {
      version: string;
      created: string;
      sourceFormat: 'json' | 'lang';
      targetFormat: 'json' | 'lang';
    };

    if (content.files['meta.json']) {
      const metaContent = await content.files['meta.json'].async('string');
      metaData = JSON.parse(metaContent);
    }

    // ソースファイルとターゲットファイルを取得
    const sourceFilename = `source.${metaData.sourceFormat}`;
    const targetFilename = `target.${metaData.targetFormat}`;

    if (!content.files[sourceFilename]) {
      throw new Error('プロジェクトファイルにソースファイルが含まれていません');
    }

    if (!content.files[targetFilename]) {
      throw new Error('プロジェクトファイルにターゲットファイルが含まれていません');
    }

    // ファイルの内容を取得
    const sourceContent = await content.files[sourceFilename].async('blob');
    const targetContent = await content.files[targetFilename].async('blob');

    // ファイルからデータをロード
    const sourceFile = new File([sourceContent], sourceFilename);
    const targetFile = new File([targetContent], targetFilename);

    const sourceData = await loadLanguageData(sourceFile);
    const targetData = await loadLanguageData(targetFile);

    return {
      sourceData,
      targetData,
      sourceFormat: metaData.sourceFormat,
      targetFormat: metaData.targetFormat
    };
  } catch (error) {
    console.error('プロジェクトのインポート中にエラーが発生しました:', error);
    throw new Error(`${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * データをファイル形式に応じて文字列に変換する
 */
function formatContent(data: LanguageData, format: 'json' | 'lang'): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  } else {
    // lang形式に変換（key=value形式）
    return Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  }
}