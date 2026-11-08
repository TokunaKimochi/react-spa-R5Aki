import { Button } from 'react-aria-components';
import { RxPlus } from 'react-icons/rx';

import TooltipWrapper from '@/components/ui/TooltipWrapper';
import { css } from 'styled-system/css';

export default function FloatingAddButton({
  text,
}: {
  text: string;
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
        fillColor="violet.500"
        className={css({ color: 'violet.50', bgColor: 'violet.500', shadow: '2xl' })}
      >
        <Button
          type="button"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: '0.75rem',
            borderWidth: '1px',
            borderRadius: '50%',
            shadow: 'sm',
            color: {
              base: 'violet.50',
              _active: { base: 'violet.800', _disabled: 'stone.300' },
            },
            bg: {
              base: 'violet.500',
              _hover: { base: 'violet.600', _disabled: 'stone.200' },
              _active: 'violet.300',
            },
            borderColor: { base: 'violet.600', _disabled: 'stone.300' },
          })}
        >
          <RxPlus size="1.5rem" className={css({ display: 'inline-block', filter: 'drop-shadow(1px 1px rgba(0, 0, 0, 0.2))' })} />
        </Button>
      </TooltipWrapper>
    </div>
  );
}
