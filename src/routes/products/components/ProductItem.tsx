import { useAtomValue } from 'jotai';
import { BiSolidGift } from 'react-icons/bi';
import { GiCheckMark } from 'react-icons/gi';

import { selectedProductsAtom } from '@/atoms/productsAtom';
import { css, cva } from 'styled-system/css';

import type { ViewSkuDetailsRow } from '../products.dbTable.types';

const imgStyle = cva({
  base: {
    display: 'block',
    bgColor: 'var(--cat-color-light)',
    w: '16rem',
    h: '13rem',
    objectFit: 'cover',
    borderTopRadius: 'lg',
  },
  variants: {
    discontinued: {
      t: { filter: 'grayscale(100%)' },
    },
  },
});
const checkStyle = css.raw({
  pos: 'absolute',
  zIndex: 1,
  top: '0.75rem',
  left: '0.75rem',
  lineHeight: '1.75rem',
  p: '1rem',
  bgColor: 'emerald.50',
  color: 'emerald.500',
  borderRadius: 'full',
});
const markStyle = css.raw({
  pos: 'absolute',
  zIndex: 1,
  top: '0.75rem',
  right: '0.75rem',
  lineHeight: '1.75rem',
  p: '1rem',
  fontSize: 'xl',
  fontWeight: 'bold',
  bgColor: 'zinc.600',
  color: 'rose.500',
  borderRadius: 'md',
});

export default function ProductItem(p: ViewSkuDetailsRow & {
  index: number;
  setSelectedItem: React.Dispatch<React.SetStateAction<number>>;
  imageUrl?: string;
  now: number;
}) {
  const selectedProducts = useAtomValue(selectedProductsAtom);
  const isSelected = selectedProducts.some(product => product.sku_id === p.sku_id);

  const discontinued = p.discontinued_date
    ? p.now > new Date(p.discontinued_date).getTime() ? { discontinued: 't' } as const : undefined
    : undefined;

  return (
    <article
      className={css({
        pos: 'relative',
        bgColor: 'var(--cat-color)',
        bgImage: 'linear-gradient(90deg in oklch, var(--cat-color), oklch(from var(--cat-color) calc(l + 0.1) c h))',
        borderRadius: 'lg',
        shadow: 'xl',
      })}
      style={{
        '--cat-color': `var(--colors-${p.category_color}-${p.category_color_shade})`,
        '--cat-color-light': `var(--colors-${p.category_color}-${Number(p.category_color_shade) - 100})`,
        '--cat-text-color': `var(--colors-${p.category_color}-950)`,
      } as React.CSSProperties}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        onClick={() => p.setSelectedItem(p.index)}
        onKeyDown={() => p.setSelectedItem(p.index)}
        className={css({ display: 'block', textAlign: 'left', w: '100%', h: 'fit-content', p: 0, cursor: 'pointer' })}
      >
        <figure>
          {p.imageUrl?.startsWith('http')
            ? (
                <div
                  className={css({
                    w: 'fit-content',
                    mx: 'auto',
                    pos: 'relative',

                    // data-error属性が付与されたら「NO IMAGE」を表示
                    '&[data-error="true"]::after': {
                      content: '"NO IMAGE"',
                      pos: 'absolute',
                      top: 0,
                      left: 0,
                      w: '100%',
                      h: '100%',
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: '"Palatino Linotype"',
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      lineHeight: '3rem',
                      textWrap: 'balance',
                      textAlign: 'center',
                    },
                  })}
                >
                  {isSelected
                    ? <span className={css(checkStyle)}><GiCheckMark strokeWidth="3.5rem" /></span>
                    : null}
                  {discontinued?.discontinued === 't'
                    ? <mark className={css(markStyle)}>終売</mark>
                    : null}
                  <img
                    src={p.imageUrl}
                    alt={p.product_name}
                    onError={(e) => {
                      // 親要素(div)にエラーフラグを立てる
                      e.currentTarget.parentElement?.setAttribute('data-error', 'true');
                      // 壊れた画像アイコンを消すために透明GIFに差し替え
                      e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    }}
                    className={imgStyle(discontinued)}
                  />
                </div>
              )
            : (
                <dfn className={css({
                  pos: 'relative',
                  bgColor: 'var(--cat-color-light)',
                  borderTopRadius: 'lg',
                  display: 'grid',
                  placeItems: 'center',
                  fontStyle: 'normal',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  lineHeight: '3rem',
                  textWrap: 'balance',
                  textAlign: 'center',
                  minH: '13rem',
                },
                )}
                >
                  {discontinued?.discontinued === 't'
                    ? <mark className={css(markStyle)}>終売</mark>
                    : null}
                  <div className={css({
                    px: '0.5rem',
                    py: '0.725rem',
                    color: 'transparent',
                    bgImage: 'radial-gradient(oklch(from var(--cat-color) l calc(c + 0.025) h), var(--cat-text-color))',
                    bgClip: 'text',
                  })}
                  >
                    {p.sku_name}
                  </div>
                </dfn>
              )}
        </figure>
        <div className={css({
          px: '0.5rem',
          py: '0.725rem',
          fontSize: '0.85rem',
          fontWeight: 'bold',

          '& svg': { display: 'inline-block', mr: '0.125rem' },
        })}
        >
          <h2 className={css({ fontSize: '1.25rem', fontWeight: 'bold' })}>
            <span className={css({ textShadow: 'rgba(255, 255, 255, 0.2) 1px 1px', transform: 'rotate(-7.5deg) translateY(-0.2rem)', display: 'inline-block' })}>
              {p.sku_name}
            </span>
            <span className={css({ bgColor: 'var(--cat-color-light)', verticalAlign: 'super', fontSize: '0.625em', ml: '0.4em', px: '0.25em', py: '0.125em' })}>{p.display_category_name}</span>
            <span className={css({ ml: '0.25rem' })}>
              {p.max_piece_weight >= 1000 ? `${p.max_piece_weight / 1000}kg` : `${p.max_piece_weight}g`}
            </span>
          </h2>
          <p className={css({ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' })}>
            {p.is_set_product ? <BiSolidGift size="1.375em" /> : null}
            <span>{p.product_name}</span>
            {p.case_quantity
              ? (
                  <span className={css({ pos: 'absolute', display: 'inline-block', bottom: '0.025rem', right: '0.375rem', pointerEvents: 'none', fontFamily: '"Time New Roman",sans-serif' })}>
                    {`[ ${p.case_quantity} ]`}
                  </span>
                )
              : null}
          </p>
        </div>
      </button>
    </article>
  );
}
