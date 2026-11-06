import type { z } from 'zod';

import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import type { productsStorageSchema } from '@/routes/products/products.storage.schemas';

export type ProductsFormValues = z.infer<typeof productsStorageSchema>;

const purchaseOrderStorage = createJSONStorage<ProductsFormValues | null>(() => window.localStorage);

const purchaseOrderFormValuesStorageAtom = atomWithStorage<ProductsFormValues | null>(
  'purchase-order-form-values:v1',
  null,
  purchaseOrderStorage,
  { getOnInit: true },
);

/** 保存済みの RHF 入力値を取得する。未保存の場合は null。 */
export const purchaseOrderFormValuesAtom = atom(get => get(purchaseOrderFormValuesStorageAtom));

/** RHF の現在の入力値をセッションストレージへ保存する。 */
export const savePurchaseOrderFormValuesAtom = atom(
  null,
  (_get, set, values: ProductsFormValues) => set(purchaseOrderFormValuesStorageAtom, values),
);

/** 終了、全消去。 */
export const clearPurchaseOrderFormValuesAtom = atom(
  null,
  (_get, set) => set(purchaseOrderFormValuesStorageAtom, null),
);
