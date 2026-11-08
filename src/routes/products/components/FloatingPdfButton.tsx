import type { PressEvent } from 'react-aria-components';

import { Button } from 'react-aria-components';
import { FaFilePdf } from 'react-icons/fa';

import TooltipWrapper from '@/components/ui/TooltipWrapper';
import { css } from 'styled-system/css';

export default function FloatingPdfButton({
  text,
  clickHandler,
  isDisabled = false,
}: {
  text: string;
  clickHandler?: ((e: PressEvent) => void);
  isDisabled?: boolean;
}) {
  return (
    <div
      className={css({
        pos: 'fixed',
        bottom: 'min(4.375rem, 10lvh)',
        right: '1.375rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      })}
    >
      <TooltipWrapper
        text={text}
        placement="top start"
        hasButton={true}
        fillColor="orange.400"
        className={css({ color: 'orange.950', bgColor: 'orange.400', shadow: '2xl' })}
      >
        <Button
          type="button"
          onPress={clickHandler}
          isDisabled={isDisabled}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: '0.75rem',
            borderWidth: '1px',
            borderRadius: '50%',
            shadow: 'sm',
            cursor: 'pointer',
            color: {
              base: 'orange.950',
              _active: { base: 'orange.700', _disabled: 'stone.300' },
              _disabled: 'stone.200',
            },
            bg: {
              base: 'orange.400',
              _hover: { base: 'orange.500', _disabled: 'stone.200' },
              _active: 'orange.200',
              _disabled: 'stone.300',
            },
            borderColor: { base: 'orange.500', _disabled: 'stone.300' },
          })}
        >
          <FaFilePdf size="1.5rem" className={css({ display: 'inline-block', filter: 'drop-shadow(1px 1px rgba(255, 255, 255, 0.3))' })} />
        </Button>
      </TooltipWrapper>
    </div>
  );
}
