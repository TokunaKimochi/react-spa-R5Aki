import { css } from 'styled-system/css';
import React from 'react';
import { ShippingInstructionPrintHistoryTbRow } from '../shippingInstructionPrintouts.types';

interface PrintHistoryTableTrProps {
  oneHistory: ShippingInstructionPrintHistoryTbRow;
  toggleModal: React.Dispatch<React.SetStateAction<number>>;
  currentIndex: number;
  parentMediaQuerySmall: string;
  parentMediaQueryHd: string;
}

export default function PrintHistoryTableTr({
  oneHistory: po,
  toggleModal,
  currentIndex,
  parentMediaQuerySmall,
  parentMediaQueryHd,
}: PrintHistoryTableTrProps): JSX.Element {
  // Panda CSS で使用する変数
  const smallScreen = '@media(width < 960px)';
  const hdScreen = '@media(width < 1280px)';

  if (parentMediaQuerySmall !== smallScreen || parentMediaQueryHd !== hdScreen) {
    throw new Error(
      `［値の完全一致が必要］： parentMediaQuerySmall: "${parentMediaQuerySmall}", smallScreen: "${smallScreen}", parentMediaQueryHd: "${parentMediaQueryHd}", hdScreen: "${hdScreen}"`,
    );
  }

  return (
    <tr
      onClick={() => toggleModal(currentIndex)}
      onKeyDown={() => toggleModal(currentIndex)}
      role="button"
      className={css({ _even: { color: 'slate.950', bgColor: 'slate.200' }, cursor: 'pointer' })}
    >
      <td
        className={css({
          [smallScreen]: {
            maxW: '4.3rem',
            direction: 'rtl',
            overflow: 'hidden',
          },
        })}
      >
        {po.delivery_date}
      </td>
      <td className={css({ [smallScreen]: { display: 'none' } })}>{po.delivery_time_str}</td>
      <td
        className={css({
          maxW: '8rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        })}
      >
        {po.printed_at}
      </td>
      <td className={css({ [smallScreen]: { display: 'none' } })}>{po.page_num_str}</td>
      <td
        className={css({
          maxW: '16rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          [hdScreen]: { maxW: '11rem' },
        })}
      >
        <data value={po.non_fk_customer_id}>{po.customer_name}</data>
      </td>
      <td
        className={css({
          maxW: '12rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          [hdScreen]: { display: 'none' },
        })}
      >
        {po.customer_address}
      </td>
      <td className={css({ [smallScreen]: { display: 'none' } })}>{po.wholesaler}</td>
      <td
        className={css({
          maxW: '16rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          [hdScreen]: { display: 'none' },
        })}
      >
        {po.order_number}
      </td>
      <td
        className={css({
          [smallScreen]: {
            maxW: '4.3rem',
            direction: 'rtl',
            overflow: 'hidden',
          },
        })}
      >
        {po.shipping_date}
      </td>
      <td>{po.carrier}</td>
      <td>{po.package_count}</td>
      <td
        className={css({
          maxW: '16rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          [hdScreen]: { maxW: '11rem' },
        })}
      >
        {po.items_of_order}
      </td>
    </tr>
  );
}
