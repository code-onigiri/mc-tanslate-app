# TranslateData クラスのドキュメント

`TranslateData` クラスは、階層構造を持つ翻訳データを管理するためのユーティリティクラスです。キーと値のペアを階層的に格納し、効率的に検索・更新するための機能を提供します。

## 型定義

- `TranslateKey`: 文字列型のキー
- `TranslateDataID`: 数値型のキー
- `NestedStructure<T>`: キーと値のペアを持つ階層構造のオブジェクト

## コンストラクタ

```typescript
constructor(initialData?: NestedStructure<unknown>)
```

- **引数**: `initialData` - 初期データ（オプション）
- **説明**: 新しい `TranslateData` インスタンスを作成します。初期データが指定されている場合はそれを使用します。

## メソッド

### getData()

```typescript
getData(): NestedStructure<unknown>
```

- **戻り値**: 格納されているデータ構造
- **説明**: 現在保持しているデータ全体を取得します。

### addlast(key, value)

```typescript
addlast(key: TranslateKey | TranslateDataID, value: string | NestedStructure<unknown>): void
```

- **引数**:
  - `key` - 追加するキー
  - `value` - 追加する値
- **説明**: 指定されたキーと値のペアをデータの最後に追加します。

### addbackkey(placeKey, key, value)

```typescript
addbackkey(placeKey: TranslateKey | TranslateDataID, key: TranslateKey | TranslateDataID, value: string | NestedStructure<unknown>): void
```

- **引数**:
  - `placeKey` - 挿入位置となる既存のキー
  - `key` - 追加するキー
  - `value` - 追加する値
- **説明**: 指定された `placeKey` の直後に新しいキーと値のペアを挿入します。`placeKey` が見つからない場合は、データの最後に追加します。

### search_value(value)

```typescript
search_value(value: string | NestedStructure<unknown>): (TranslateKey | TranslateDataID)[] | null
```

- **引数**: `value` - 検索する値
- **戻り値**: 値が見つかった場合はキーパスの配列、見つからなかった場合は `null`
- **説明**: 指定された値に一致するエントリをデータ内で検索し、そのキーパスを返します。ネストされた構造にも対応しています。

### search_key(keyPath)

```typescript
search_key(keyPath: (TranslateKey | TranslateDataID)[] | TranslateKey | TranslateDataID): string | NestedStructure<unknown> | null
```

- **引数**: `keyPath` - 検索するキーまたはキーパスの配列
- **戻り値**: キーパスに対応する値、見つからなかった場合は `null`
- **説明**: 指定されたキーパスに対応する値を取得します。単一のキーまたはキーパスの配列を指定できます。

### set(keyPath, value)

```typescript
set(keyPath: (TranslateKey | TranslateDataID)[], value: string | NestedStructure<unknown>): void
```

- **引数**:
  - `keyPath` - 設定する位置を指定するキーパスの配列
  - `value` - 設定する値
- **説明**: 指定されたキーパスの位置に値を設定します。パスの途中のオブジェクトが存在しない場合は自動的に作成されます。

### remove(keyPath)

```typescript
remove(keyPath: (TranslateKey | TranslateDataID)[] | TranslateKey | TranslateDataID): boolean
```

- **引数**: `keyPath` - 削除するキーまたはキーパスの配列
- **戻り値**: 削除に成功した場合は `true`、キーが見つからなかった場合は `false`
- **説明**: 指定されたキーパスの位置にあるエントリを削除します。単一のキーまたはキーパスの配列を指定できます。

## 使用例

```typescript
// インスタンスの作成
const translations = new TranslateData();

// データの追加
translations.addlast("greeting", "Hello");
translations.addlast("menu", { file: "File", edit: "Edit" });

// ネストされたデータの設定
translations.set(["menu", "view"], "View");
translations.set(["menu", "help", "about"], "About");

// データの検索
const menuPath = translations.search_value("Edit"); // ["menu", "edit"]を返す
const greeting = translations.search_key("greeting"); // "Hello"を返す
const viewValue = translations.search_key(["menu", "view"]); // "View"を返す

// データの削除
translations.remove(["menu", "help", "about"]); // trueを返す
```
