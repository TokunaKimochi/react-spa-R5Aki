import type { CalendarDate } from '@internationalized/date';

import { Document, Font, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useAtomValue } from 'jotai';

import { purchaseOrderFormValuesAtom } from '@/atoms/purchaseOrderAtom';
import env from '@/env';

import { productsStorageSchema } from '../products.storage.schemas';

// A4 & FAX対応の厳格なスタイル定義
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'NotoSansJP',
  },

  // ヘッダー情報用のスタイル
  headerInfoContainer: {
    marginBottom: 10,
  },
  companyNameRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  companyNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  metaInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#000000',
  },

  title: {
    fontSize: 22,
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
    borderTopColor: '#000000',
    borderLeftColor: '#000000',
    borderStyle: 'solid',
  },

  // 行（Row）のスタイル
  tableRow: {
    flexDirection: 'row',
    minHeight: 35,
    alignItems: 'center',
  },
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
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
  },
});

// 日本語フォントを登録する
Font.register({
  family: 'NotoSansJP',
  src: '/spa/fonts/NotoSansJP-Medium.ttf',
});

const headers = ['商品名', '内容量', '数量', '備考', '納品日', '希望時間'] as const;
const FIXED_ROW_COUNT = 7; // 固定の行数

export default function PurchaseOrderPdfDocument() {
  const inputValues = useAtomValue(purchaseOrderFormValuesAtom);
  const orders = productsStorageSchema.parse(inputValues).products;

  // 固定7行になるように不足分を空のオブジェクトで埋めた配列を作成
  const paddedOrders = [...orders];
  while (paddedOrders.length < FIXED_ROW_COUNT) {
    paddedOrders.push(null as any);
  }

  // 現在日時のフォーマット（例: 2026年11月6日（金） 13:59 ※24時間制）
  const currentDateStr = (() => {
    const now = new Date();
    const dateString = now.toLocaleDateString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const weekStr = new Intl.DateTimeFormat('ja-JP', {
      weekday: 'short',
      timeZone: 'Asia/Tokyo',
    }).format(now);

    // 24時間制の時間と分を取得
    const timeString = now.toLocaleTimeString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${dateString}（${weekStr}） ${timeString}`;
  })();

  // 納品日のフォーマット
  const deliveryDateStr = (date: CalendarDate) => {
    const dateStr = `${date.year}-${date.month}-${date.day}`;
    const jsDate = new Date(dateStr);
    const weekStr = new Intl.DateTimeFormat('ja-JP', {
      weekday: 'short',
      timeZone: 'Asia/Tokyo',
    }).format(jsDate);
    const dateString = jsDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', dateStyle: 'short' });
    return `${dateString}（${weekStr}）`;
  };

  // 通常商品の内容量や入数を整えて文字列に
  /* formatProductPack */
  // セット商品のセット内容や入数を整えて文字列に
  /* formatSetPack */

  // .env から会社名を取得
  const companyName = env.VITE_COMPANY_NAME;

  return (
    <PDFViewer className="pdf-viewer">
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>

          {/* タイトルの上の2行の情報エリア */}
          <View style={styles.headerInfoContainer}>
            {/* 1行目：.env から読み取った会社名を右端寄せ */}
            <View style={styles.companyNameRow}>
              <Text style={styles.companyNameText}>{companyName}</Text>
            </View>

            {/* 2行目：左右寄せ（左: センター ➡️ 工場 / 右: 現在日時＋24時間制の時刻） */}
            <View style={styles.metaInfoRow}>
              <Text style={styles.metaText}>センター ➡️ 工場</Text>
              <Text style={styles.metaText}>{currentDateStr}</Text>
            </View>
          </View>

          {/* 帳票タイトル */}
          <Text style={styles.title}>注文書</Text>

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

            {/* 2. データ行（常に7行分） */}
            {paddedOrders.map((o, cellIndex) => (
              <View style={styles.tableRow} key={`cell-${cellIndex}-${o ? o.sku_id : `empty-${cellIndex}`}`}>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    {o ? o.sku_name : ''}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    {o
                      ? (o.components ? o.components[0].amount : o.combinations[0].item_product_short_name)
                      : ''}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    {o ? `${o.order_quantity} ${o.order_unit}` : ''}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    {o ? o.remark : ''}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    {o?.delivery_date?.year && o.delivery_date?.month && o.delivery_date?.day
                      ? deliveryDateStr(o.delivery_date)
                      : ''}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    {o ? o.delivery_time_slot : ''}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
