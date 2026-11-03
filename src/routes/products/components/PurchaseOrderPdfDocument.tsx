import { Document, Font, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useLocation } from 'react-router';

import { productsStorageSchema } from '../products.storage.schemas';

// A4 & FAX対応の厳格なスタイル定義
const styles = StyleSheet.create({
  page: {
    // size や orientation は Page コンポーネントの props で指定するためスタイルから除外
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 30, // 印刷不可領域を絶対に踏まないための安全マージン（約10mm）
    backgroundColor: '#ffffff',
    fontFamily: 'NotoSansJP',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NotoSansJP',
  },

  // テーブル全体のコンテナ
  table: {
    width: '100%',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopColor: '#000000', // FAXで消えない純粋な黒
    borderLeftColor: '#000000',
    borderStyle: 'solid',
  },

  // 行（Row）のスタイル
  tableRow: {
    flexDirection: 'row',
    minHeight: 35, // FAXでも文字が潰れない十分な行の高さ
    alignItems: 'center',
  },
  // タイトル行（ヘッダー）の背景を少し区別（FAXを考慮し薄いグレー）
  tableHeaderRow: {
    backgroundColor: '#eeeeee',
  },

  // セル（Cell）のスタイル
  tableCell: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRightColor: '#000000',
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    padding: 4,
  },

  // テキスト
  cellText: {
    fontSize: 10,
    color: '#000000',
  },
  headerText: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
  },
});

// 日本語フォントを登録する（ファイルパスまたはURL）
Font.register({
  family: 'NotoSansJP',
  src: '/spa/fonts/NotoSansJP-Medium.ttf', // 例: Noto Sans JP
});

// データ定義（as const を利用して読み取り専用の厳格なタプル型に）
const headers = ['col_1', 'col_1', 'col_1', 'col_1', 'col_1', 'col_1'] as const;

// 参照共有バグを防ぎ、型安全に string[][] として生成
const rows: string[][] = Array.from({ length: 7 }, () => [
  '日本語のテスト',
  'data_1',
  'data_1',
  'data_1',
  'data_1',
  'data_1',
]);

export default function PurchaseOrderPdfDocument() {
  const location = useLocation();
  const locationState = productsStorageSchema.parse(location.state);
  const { products } = locationState;

  return (
    <PDFViewer className="pdf-viewer">
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          {/* 帳票タイトル */}
          <Text style={styles.title}>{products[0].sku_name}</Text>

          {/* テーブル構造 */}
          <View style={styles.table}>

            {/* 1. タイトル行（ヘッダー） */}
            <View style={{ ...styles.tableRow, ...styles.tableHeaderRow }}>
              {headers.map((header, index) => (
                <View style={styles.tableCell} key={`header-${index}`}>
                  <Text style={styles.headerText}>{header}</Text>
                </View>
              ))}
            </View>

            {/* 2. データ行（7行分） */}
            {rows.map((row, rowIndex) => (
              <View style={styles.tableRow} key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <View style={styles.tableCell} key={`cell-${rowIndex}-${cellIndex}`}>
                    <Text style={styles.cellText}>
                      {cell}
                      {products[0].delivery_date?.toString()}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
