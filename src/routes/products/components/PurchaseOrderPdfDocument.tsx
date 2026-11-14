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
    marginBottom: 6,
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
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#000000',
  },

  title: {
    fontSize: 22,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
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
    minHeight: 50,
    alignItems: 'center',
  },
  tableHeaderRow: {
    minHeight: 30,
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

  // 一番左のセル専用のスタイル（上下に要素を分散配置）
  firstTableCell: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRightColor: '#000000',
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    padding: 4,
  },
  // 左上・右上配置用の行コンテナ
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  topLeftText: {
    fontFamily: 'BIZUDPGothic',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  topRightText: {
    fontFamily: 'BIZUDPGothic',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#eeeeee',
  },
  // 中央配置用のコンテナ
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // テキスト
  cellText: {
    fontFamily: 'BIZUDPGothic',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
  },
  headerText: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'bold',
  },
});

// 日本語フォントを登録する
Font.register({
  family: 'BIZUDPGothic',
  fonts: [
    { src: '/spa/fonts/BIZUDPGothic/BIZUDPGothic-Regular.ttf', fontWeight: 400 },
    { src: '/spa/fonts/BIZUDPGothic/BIZUDPGothic-Bold.ttf', fontWeight: 700 },
  ],
});
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/spa/fonts/NotoSansJP/NotoSansJP-Medium.ttf', fontWeight: 400 },
    { src: '/spa/fonts/NotoSansJP/NotoSansJP-Bold.ttf', fontWeight: 700 },
  ],
});

// 単語を1文字ずつに分割し、各文字の後ろに空文字 '' を挟むことで、- を出さずにどの文字の間でも自然に改行
Font.registerHyphenationCallback(word =>
  Array.from(word).flatMap(char => [char, '']),
);

const headers = ['品番・種別・品名', '内容量／内容物', '入数', '荷姿数', '備考', '納品日', '希望時間'] as const;
const columnFlex = [1.2, 0.8, 0.7, 0.7, 1.9, 0.8, 0.8] as const;
const FIXED_ROW_COUNT = 7; // 固定の行数

export default function PurchaseOrderPdfDocument() {
  const inputValues = useAtomValue(purchaseOrderFormValuesAtom);
  const orders = productsStorageSchema.parse(inputValues).products;

  // 固定7行になるように不足分を空のオブジェクトで埋めた配列を作成
  const paddedOrders = [...orders];
  while (paddedOrders.length < FIXED_ROW_COUNT) {
    paddedOrders.push(null as never);
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
    const dateString = jsDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', dateStyle: 'short' }).slice(5);
    return `${dateString}（${weekStr}）`;
  };

  // 通常商品の内容量
  const formatAmount = ({ length, symbol, amount, pieces }: {
    length: number;
    symbol: string;
    amount: string;
    pieces: number;
  }) => {
    const symbolStr = length > 1 ? `${symbol} ` : '';
    const num = Number(amount);
    const piecesStr = pieces === 1 ? '' : `×${pieces}`;
    if (Number.isInteger(num)) {
      if (num > 999) {
        const numKg = num / 1000;
        return `${symbolStr}${numKg}kg${piecesStr}`;
      }
    }
    return `${symbolStr}${num}g${piecesStr}`;
  };

  const formatSetDetails = (item: string, quantity: number) => {
    return `${item} × ${quantity}`;
  };
  // 通常商品の内容量や入数を整えて文字列に
  const formatPackaging = ({ order_unit, quantity, icQuantity }: {
    order_unit: 'case' | 'inner_carton' | 'piece';
    quantity: number | null;
    icQuantity: number | null;
  }) => {
    const caseQuantity = (icQuantity && quantity) ? quantity / icQuantity : quantity;
    if (order_unit === 'case') {
      if (icQuantity)
        return `${icQuantity}×${caseQuantity}`;
      return quantity;
    }
    else if (order_unit === 'inner_carton') {
      return icQuantity;
    }
    return '';
  };

  // 発注数を整えて文字列に
  const formatOrderQuantity = (quantity: number, unit: 'case' | 'inner_carton' | 'piece') => {
    if (unit === 'case')
      return `${quantity} ケース`;
    if (unit === 'inner_carton')
      return `${quantity} ボール`;
    return `${quantity} 個`;
  };

  // 希望納品時間を「〇〇まで」に整える
  const formatTimeSlot = (timeSlot: string) => {
    if (timeSlot.length !== 3 && timeSlot.length !== 4) {
      return timeSlot;
    }
    return `${timeSlot.slice(0, -2)}:${timeSlot.slice(-2)} まで`;
  };

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
                // eslint-disable-next-line react/no-array-index-key
                <View style={[styles.tableCell, { flex: columnFlex[index] }]} key={`header-${index}`}>
                  <Text style={styles.headerText}>{header}</Text>
                </View>
              ))}
            </View>

            {/* 2. データ行（常に7行分） */}
            {paddedOrders.map((o, cellIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <View style={styles.tableRow} key={`cell-${cellIndex}`}>

                {/* 1番目のセル：品番・種別・品名（左上・右上・中央に配置） */}
                <View style={[styles.firstTableCell, { flex: columnFlex[0] }]}>
                  <View style={styles.topRowContainer}>
                    {/* 左上（例: 品番コードなど） */}
                    <Text style={styles.topLeftText}>
                      35114
                      {/* {o ? o.sku_code : ''} */}
                    </Text>
                    {/* 右上（例: 種別など） */}
                    <Text style={styles.topRightText}>
                      グリーンティー他
                      {/* {o ? o.sku_type : ''} */}
                    </Text>
                  </View>
                  <View style={styles.centerContainer}>
                    {/* 中央：メインのSKU名 */}
                    <Text style={styles.cellText}>{o ? o.sku_name : ''}</Text>
                  </View>
                </View>

                {/* 2番目以降のセル */}
                <View style={[styles.tableCell, { flex: columnFlex[1] }]}>
                  {o
                    ? (
                        o.components && o.components.length > 0
                          ? (
                              o.components.map((c, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Text key={index} style={styles.cellText}>
                                  {formatAmount({
                                    length: o.components.length,
                                    symbol: c.symbol,
                                    amount: c.amount,
                                    pieces: c.pieces,
                                  })}
                                </Text>
                              ))
                            )
                          : o.combinations && o.combinations.length > 0
                            ? (
                                o.combinations.map(c => (
                                  <Text key={c.combination_id} style={styles.cellText}>
                                    {formatSetDetails(c.item_product_short_name, c.quantity)}
                                  </Text>
                                ))
                              )
                            : null
                      )
                    : null}
                </View>
                <View style={[styles.tableCell, { flex: columnFlex[2] }]}>
                  <Text style={styles.cellText}>
                    {o
                      ? formatPackaging({
                          order_unit: o.order_unit,
                          quantity: o.case_quantity,
                          icQuantity: o.inner_carton_quantity,
                        })
                      : ''}
                  </Text>
                </View>
                <View style={[styles.tableCell, { flex: columnFlex[3] }]}>
                  <Text style={styles.cellText}>
                    {o?.order_quantity ? formatOrderQuantity(o.order_quantity, o.order_unit) : ''}
                  </Text>
                </View>
                <View style={[styles.tableCell, { flex: columnFlex[4] }]}>
                  <Text style={styles.cellText}>
                    {o ? o.remark : ''}
                  </Text>
                </View>
                <View style={[styles.tableCell, { flex: columnFlex[5] }]}>
                  <Text style={styles.cellText}>
                    {o?.delivery_date?.year && o.delivery_date?.month && o.delivery_date?.day
                      ? deliveryDateStr(o.delivery_date)
                      : ''}
                  </Text>
                </View>
                <View style={[styles.tableCell, { flex: columnFlex[6] }]}>
                  <Text style={styles.cellText}>
                    {o ? formatTimeSlot(o.delivery_time_slot) : ''}
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
