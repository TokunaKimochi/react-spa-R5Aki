import React from 'react';
import { Button, DateInput, DatePicker, DateSegment, Group } from 'react-aria-components';
import { CalendarDate } from '@internationalized/date';
import { css } from 'styled-system/css';
import { FaCalendar } from 'react-icons/fa6';

export default function DatePickerInput({
  children,
  todayDate,
}: {
  children: React.ReactNode;
  todayDate: CalendarDate;
}): JSX.Element {
  return (
    <DatePicker
      aria-label="date picker"
      defaultValue={todayDate}
      className={css({
        display: 'flex',
        flexDir: 'column',
        gap: '0.5rem',
        w: '10rem',
      })}
    >
      <Group
        className={css({
          display: 'flex',
          alignItems: 'center',
          color: 'slate.700',
          bgColor: 'slate.50/90',
          borderRadius: 'md',
          boxShadow: 'sm',
          pl: '0.65rem',
          '&:where([data-rac])[data-focus-within]': { color: 'slate.950', bgColor: 'slate.50' },
        })}
      >
        <DateInput className={css({ display: 'flex', flex: '1', py: '0.315rem' })}>
          {(segment) => (
            <DateSegment
              segment={segment}
              className={css({
                fontSize: 'md',
                lineHeight: '1.5rem',
                px: '0.125rem',
                my: '0.125rem',
                borderRadius: 'sm',
                fontVariantNumeric: 'tabular-nums',
                outline: 'none',
                _focus: { color: '#fff', bgColor: 'violet.700' },
              })}
            />
          )}
        </DateInput>
        <Button
          className={css({
            display: 'flex',
            alignItems: 'center',
            outline: 'none',
            px: '0.65rem',
            color: 'slate.600',
          })}
        >
          <FaCalendar size="1.125rem" />
        </Button>
      </Group>
      {children}
    </DatePicker>
  );
}
