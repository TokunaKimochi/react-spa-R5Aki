import '@/components/ui/reactAriaModalOverlayBottomSheet.css';
import { calculateCheckDigitForGTIN } from 'gtin-validator';
import { useAtomValue, useSetAtom } from 'jotai';
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { BsFillTelephoneForwardFill, BsStars } from 'react-icons/bs';
import { FaCartArrowDown, FaFax, FaPenClip, FaStar } from 'react-icons/fa6';
import { GiKangaroo } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
import { TbPackageExport } from 'react-icons/tb';
import { useNavigate } from 'react-router';

import type { SelectedProduct } from '@/atoms/productsAtom';

import { removeSelectedProductAtom, selectedProductsAtom, selectProductAtom } from '@/atoms/productsAtom';
import Button from '@/components/ui/elements/Button';
import TooltipWrapper from '@/components/ui/TooltipWrapper';
import env from '@/env';
import { css } from 'styled-system/css';

import type { ViewSkuDetailsRow } from '../products.dbTable.types';
import type { NewQuantityVariantDefaultValues, NewUnifiedRevisionDefaultValues, PutReqUnifiedProductWithNull } from '../products.types';

import { useFetchProductCombinations } from './hooks/useFetchProductCombinations';
import { useFetchProductComponents } from './hooks/useFetchProductComponents';
import { useFetchProductSkuTags } from './hooks/useFetchProductSkuTags';
import NIl from './NIl';
import ProductCompositionItems from './ProductCompositionItems';
import ProductImageIcons from './ProductImageIcons';

type ProductBottomSheetProps = ViewSkuDetailsRow & {
  setSelectedItem: React.Dispatch<React.SetStateAction<number>>;
  isOpen?: boolean;
  images?: string[];
};

export default function ProductBottomSheet(p: ProductBottomSheetProps) {
  const { setSelectedItem, isOpen = false, images, is_set_product, ...skuDetails } = p;
  const { productCombinations } = useFetchProductCombinations({ productId: p.product_id, earlyReturn: !p.is_set_product });
  const { productComponents } = useFetchProductComponents({ productId: p.product_id, earlyReturn: p.is_set_product });
  const { productSkuTags } = useFetchProductSkuTags(p.sku_id);
  const navigate = useNavigate();

  const selectProduct = useSetAtom(selectProductAtom);
  const removeProduct = useSetAtom(removeSelectedProductAtom);
  const selectedProducts = useAtomValue(selectedProductsAtom);
  const isSelected = selectedProducts.some(product => product.sku_id === p.sku_id);

  const productForSelection: SelectedProduct = is_set_product
    ? {
        ...skuDetails,
        is_set_product: true,
        combinations: productCombinations,
      }
    : {
        ...skuDetails,
        is_set_product: false,
        components: productComponents,
      };

  // navigate.options.state 用に加工
  const {
    basic_product_id: basic_id,
    basic_product_name: basic_name,
    product_note: note,
    product_short_name: short_name,
    sku_name: skus_name,
    ...rest
  } = skuDetails;

  const skuDetailsState = {
    basic_id,
    basic_name,
    note,
    short_name,
    skus_name,
    ...rest,
    is_set_product: is_set_product ? '1' : '0' as '0' | '1',
  };

  const combinationsState = productCombinations.map(({
    combination_id,
    quantity,
    item_product_id,
  }) => ({
    combination_id,
    quantity,
    item_product_id,
  }));

  const componentsState = productComponents.map(({
    symbol,
    component_id,
    title,
    category_id,
    amount,
    unit_type_id,
    pieces,
    inner_packaging_type_id,
  }) => ({
    symbol,
    component_id,
    title,
    category_id,
    amount: Number(amount),
    unit_type_id,
    pieces,
    inner_packaging_type_id,
  }));

  const tagsState = productSkuTags.map(({
    label,
  }) => ({
    label,
    value: label,
  }));

  // ITF 予測候補を作成
  const gtin: {
    itf1: string | undefined;
    itf2: string | undefined;
    itf3: string | undefined;
  } = {
    itf1: undefined,
    itf2: undefined,
    itf3: undefined,
  };
  if (skuDetailsState.internal_code) {
    const gs1 = env.VITE_GS1_COMPANY_PREFIX;
    gtin.itf1 = `1${gs1}${skuDetailsState.internal_code}${calculateCheckDigitForGTIN(`1${gs1}${skuDetailsState.internal_code}`)}`;
    gtin.itf2 = `2${gs1}${skuDetailsState.internal_code}${calculateCheckDigitForGTIN(`2${gs1}${skuDetailsState.internal_code}`)}`;
    gtin.itf3 = `3${gs1}${skuDetailsState.internal_code}${calculateCheckDigitForGTIN(`3${gs1}${skuDetailsState.internal_code}`)}`;
  }

  return (
    <ModalOverlay isDismissable isOpen={isOpen} onOpenChange={() => setSelectedItem(-1)}>
      <Modal>
        <div className={css({ pos: 'relative' })}>
          <div className={css({
            position: 'absolute',
            top: 'max(-3.125rem, calc(10dvh * -1 + 0.375rem))',
            right: '1rem',
            display: 'flex',
            gap: '0.75rem',

            '&>button': {
              w: '2.5rem',
              h: '2.5rem',
              borderRadius: 'full',
              shadow: 'lg',
              display: 'grid',
              placeItems: 'center',
              transition: 'transform 0.1s',

              _hover: {
                transform: 'scale(1.2)',
              },
            },
          })}
          >
            <button
              type="button"
              onClick={() => {
                return isSelected
                  ? (() => {
                      removeProduct(p.sku_id);
                      setSelectedItem(-1);
                    })()
                  : (() => {
                      selectProduct(productForSelection);
                      setSelectedItem(-1);
                    })();
              }}
              className={css({
                bg: isSelected ? 'orange.400' : 'slate.700',
                color: isSelected ? 'orange.950' : 'slate.50',
              })}
            >
              <FaCartArrowDown size="1.175rem" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedItem(-1)}
              className={css({
                bg: 'slate.50',
                color: 'slate.900',
                fontWeight: 'bold',
              })}
            >
              <RxCross1 strokeWidth=".0625rem" />
            </button>
          </div>
          <Dialog className={css({
            w: '100vw',
            minH: '50dvh',
            maxH: '90dvh',
            px: '0.5rem',
            py: '0.725rem',
            bg: 'slate.400',
            color: 'yellow.200',
            fontFamily: 'Verdana, "Noto Sans JP", "BIZ UDPGothic", sans-serif',
            fontWeight: 'medium',
            letterSpacing: '0.02em',
            textShadow: 'var(--colors-slate-600) 0.5px -1px',
            outline: 'none',
            borderTopRadius: '1rem',
            shadow: '0 -0.5rem 1.25rem rgba(0 0 0 / 0.1)',
            overflow: 'scroll',
            scrollbarWidth: 'none',
          })}
          >
            <section className={css({ display: 'grid', placeItems: 'center' })}>
              <Heading
                slot="title"
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '2xl',
                  fontWeight: 'black',

                  '& + :not(:has(img))': { mt: '2rem' },
                })}
              >
                <TooltipWrapper
                  text={(
                    <>
                      ＪＡＮ維持で
                      <br />
                      リニューアル
                    </>
                  )}
                  fillColor="orange.400"
                  placement="top"
                  className={css({ color: 'orange.950', bgColor: 'orange.400', shadow: '2xl' })}
                >
                  <button
                    type="button"
                    onClick={() => {
                      Promise.resolve(
                        navigate('/products/new/revision-same-jan', {
                          relative: 'path',
                          state: {
                            basic_id: skuDetailsState.basic_id,
                            basic_name: skuDetailsState.basic_name,
                            packaging_type_id: skuDetailsState.packaging_type_id,
                            is_set_product: skuDetailsState.is_set_product,
                            itf_case_code: gtin.itf1,
                            itf_inner_carton_code: gtin.itf2,
                            componentsArrayLength: componentsState.length,
                            combinationsArrayLength: combinationsState.length,
                          } satisfies NewUnifiedRevisionDefaultValues,
                        }),
                      ).catch((err: string) => { throw new Error(err); });
                    }}
                    className={css({ mr: '0.125rem', color: 'cyan.300', cursor: 'pointer' })}
                  >
                    <BsStars />
                  </button>
                </TooltipWrapper>
                {p.sku_name}
                <TooltipWrapper
                  text="入数違い📦️新ＳＫＵ"
                  fillColor="orange.400"
                  placement="top"
                  className={css({ color: 'orange.950', bgColor: 'orange.400', shadow: '2xl' })}
                >
                  <button
                    type="button"
                    onClick={() => {
                      Promise.resolve(
                        navigate('/products/new/quantity-variant', {
                          relative: 'path',
                          state: {
                            product_id: skuDetailsState.product_id,
                            product_name: skuDetailsState.product_name,
                            skus_name: skuDetailsState.skus_name,
                            itf_case_code: gtin.itf1,
                            itf_inner_carton_code: gtin.itf3,
                          } satisfies NewQuantityVariantDefaultValues,
                        }),
                      ).catch((err: string) => { throw new Error(err); });
                    }}
                    className={css({ ml: '0.125rem', color: 'cyan.300', cursor: 'pointer' })}
                  >
                    <TbPackageExport size="1.675rem" />
                  </button>
                </TooltipWrapper>
                <span className={css({ display: 'flex', alignItems: 'center', fontSize: '0.625em', ml: '1rem', color: 'yellow.300' })}>
                  (ＳＫＵ別・略称)
                  <span className={css({
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: 'orange.400',
                    textShadow: 'none',
                  })}
                  >
                    <FaStar className={css({ ml: '0.5rem', mr: '0.125rem' })} />
                    {p.priority}
                  </span>
                </span>
              </Heading>
              {images ? <ProductImageIcons imageUrls={images} /> : null}
              <ul className={css({
                display: 'flex',
                flexWrap: 'wrap', // 溢れたら折り返す
                gap: '1.5rem',

                '&>li': {
                  maxW: '28rem',
                  mx: 'auto',
                  // 中身が1行に収まりきらなくなると、その要素が次の行へ落ちる
                  flex: 'auto', // flex-grow: 1, flex-shrink: 1, flex-basis: auto
                  color: 'yellow.400',
                },

                '& ul, & ol': {
                  pl: '2.125rem',

                  '&>li': {
                    color: 'yellow.300',

                    '&>ul>li, &>ol>li': { color: 'yellow.200' },
                  },
                },
                '& strong': { color: 'green.300', fontStyle: 'normal' },
              })}
              >
                <li>
                  単品詳細
                  <span className={css({ color: 'slate.600', fontSize: '0.75em', fontWeight: 'normal', ml: '0.75rem', textShadow: 'none' })}>
                    {`-${p.ulid_str}-`}
                  </span>
                  <ul>
                    <li>
                      商品カタログ掲載名
                      <ul><li>{p.product_name}</li></ul>
                    </li>
                    <li>
                      品番（発注コード）
                      <ul><li>{p.internal_code ?? '未登録'}</li></ul>
                    </li>
                    <NIl contents={p.product_note}>
                      <span className={css({ display: 'flex', alignItems: 'center' })}>
                        <GiKangaroo
                          size="2rem"
                          className={css({
                            display: 'inline-block',
                            mr: '0.1rem',
                            color: 'fuchsia.400',
                            filter: 'drop-shadow(1px 1px 0 var(--colors-rose-400))',
                          })}
                        />
                        運送会社重量／メモ
                      </span>
                      <ul><li><pre className={css({ whiteSpace: 'pre-wrap', fontWeight: 'bold', color: 'yellow.100' })}>{p.product_note}</pre></li></ul>
                    </NIl>
                    <li>
                      JAN コード
                      <ul><li>{p.jan_code ?? '未登録'}</li></ul>
                    </li>
                    <li>
                      製造販売タイプ
                      <ul><li>{p.sourcing_type}</li></ul>
                    </li>
                    <li>
                      商品カテゴリー
                      <ul>
                        <li>
                          {p.display_category_name}
                          {p.is_set_product ? <strong className={css({ ml: '1rem' })}>（セット商品）</strong> : null}
                        </li>
                      </ul>
                    </li>
                    <li>
                      商品パッケージタイプ
                      <ul><li>{p.packaging_type}</li></ul>
                    </li>
                    <li>
                      賞味期限（期間）
                      <ul>
                        <li>
                          {p.expiration_value ?? '未登録'}
                          {p.expiration_unit === 'Y'
                            ? '年'
                            : p.expiration_unit === 'M'
                              ? '月'
                              : '日'}
                        </li>
                      </ul>
                    </li>
                    <NIl contents={p.predecessor_id}>
                      先代商品ＩＤ
                      <ul><li>{p.predecessor_id}</li></ul>
                    </NIl>
                    <ProductCompositionItems isSetProduct={p.is_set_product} productCombinations={productCombinations} productComponents={productComponents} />
                    <NIl contents={productSkuTags.length || null}>
                      タグ
                      <ul>
                        <li className={css({
                          display: 'flex',
                          flexWrap: 'wrap', // 溢れたら折り返す
                          gap: '.5rem',

                          '&>span': {
                            px: '.375rem',
                            borderRadius: 'lg',
                            textShadow: 'rgba(0, 0, 0, 0.2) 1px 1px',
                            maxW: '8rem',
                            color: 'slate.700',
                            bgColor: 'slate.200',
                            boxShadow: 'inset-2xs',
                          },
                        })}
                        >
                          {productSkuTags.map(tag => (<span key={tag.product_tags_id}>{tag.label}</span>))}
                        </li>
                      </ul>
                    </NIl>
                  </ul>
                </li>
                <li>
                  荷姿・その他詳細
                  <span className={css({ color: 'slate.600', fontSize: '0.75em', fontWeight: 'normal', ml: '0.75rem', textShadow: 'none' })}>
                    {`-${p.sku_ulid_str}-`}
                  </span>
                  <ul>
                    <li>
                      発注先
                      <ul>
                        <li>
                          {p.supplier_name1 ? ` ${p.supplier_name1.trim()}` : '未登録'}
                          {p.supplier_name2 ? ` ${p.supplier_name2.trim()}` : null}
                        </li>
                      </ul>
                    </li>
                    <NIl contents={p.supplier_note}>
                      <span className={css({ display: 'flex', alignItems: 'center' })}>
                        <BsFillTelephoneForwardFill
                          size="1.05rem"
                          className={css({
                            display: 'inline-block',
                            mr: '0.2rem',
                            color: 'yellow.100',
                            filter: 'drop-shadow(0.5px -1px 0 var(--colors-slate-600))',
                          })}
                        />
                        発注方法
                        <FaFax
                          size="1.05rem"
                          className={css({
                            display: 'inline-block',
                            mx: '0.2rem',
                            color: 'yellow.100',
                            filter: 'drop-shadow(0.5px -1px 0 var(--colors-slate-600))',
                          })}
                        />
                        メモ
                      </span>
                      <ul><li><pre className={css({ whiteSpace: 'pre-wrap', fontWeight: 'bold', color: 'yellow.100' })}>{p.supplier_note}</pre></li></ul>
                    </NIl>
                    <NIl contents={p.height_mm}>
                      商品サイズ（
                      {p.diameter_mm ? '直径' : '縦・横'}
                      ・高さ）
                      <ul>
                        <li>
                          {p.diameter_mm
                            ? `${p.diameter_mm} mm × ${p.height_mm} mm`
                            : `${p.depth_mm} mm × ${p.width_mm} mm × ${p.height_mm} mm`}
                        </li>
                      </ul>
                    </NIl>
                    <NIl contents={p.weight_g}>
                      商品重量
                      <ul><li>{`${p.weight_g} g`}</li></ul>
                    </NIl>
                    <NIl contents={p.case_quantity}>
                      ケース入数
                      <ul><li>{p.case_quantity}</li></ul>
                    </NIl>
                    <NIl contents={p.itf_case_code}>
                      ＩＴＦコード（ケース）
                      <ul><li>{p.itf_case_code}</li></ul>
                    </NIl>
                    <NIl contents={p.case_depth_mm}>
                      ケースサイズ（縦・横・高さ）
                      <ul><li>{`${p.case_depth_mm} mm × ${p.case_width_mm} mm × ${p.case_height_mm} mm`}</li></ul>
                    </NIl>
                    <NIl contents={p.case_weight_g}>
                      ケース重量
                      <ul><li>{`${p.case_weight_g} g`}</li></ul>
                    </NIl>
                    <NIl contents={p.inner_carton_quantity}>
                      ボール入数
                      <ul><li>{p.inner_carton_quantity}</li></ul>
                    </NIl>
                    <NIl contents={p.itf_inner_carton_code}>
                      ＩＴＦコード（ボール）
                      <ul><li>{p.itf_inner_carton_code}</li></ul>
                    </NIl>
                    <NIl contents={p.inner_carton_depth_mm}>
                      ボールサイズ（縦・横・高さ）
                      <ul><li>{`${p.inner_carton_depth_mm} mm × ${p.inner_carton_width_mm} mm × ${p.inner_carton_height_mm} mm`}</li></ul>
                    </NIl>
                    <NIl contents={p.inner_carton_weight_g}>
                      ボール重量
                      <ul><li>{`${p.inner_carton_weight_g} g`}</li></ul>
                    </NIl>
                  </ul>
                </li>
              </ul>
            </section>
            <div
              className={css({
                ml: 'auto',
                pos: 'fixed',
                bottom: '1rem',
                right: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              })}
            >
              <Button
                onClick={() => {
                  Promise.resolve(
                    navigate(`/products/sku/${p.sku_id}`, {
                      relative: 'path',
                      state: (
                      is_set_product
                        ? {
                            ...skuDetailsState,
                            is_set_product: '1',
                            combinations: [...combinationsState],
                            tags: tagsState.length ? [...tagsState] : null,
                          }
                      // RHF の defaultValues には undefined を渡さない！
                        : {
                            ...skuDetailsState,
                            is_set_product: '0',
                            components: [...componentsState],
                            tags: tagsState.length ? [...tagsState] : null,
                          }
                        ) satisfies PutReqUnifiedProductWithNull,
                    }),
                  ).catch((err: string) => { throw new Error(err); });
                }}
                variant="edit"
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  lineHeight: '1.5',
                })}
              >
                <FaPenClip className={css({ display: 'inline-block' })} />
                編集
              </Button>
            </div>
          </Dialog>
        </div>
      </Modal>
    </ModalOverlay>
  );
}
