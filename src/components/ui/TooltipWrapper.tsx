import type { TooltipProps } from 'react-aria-components';

import { Focusable, OverlayArrow, Tooltip, TooltipTrigger } from 'react-aria-components';
import '@/components/ui/reactAriaTooltip.css';

import { css } from 'styled-system/css';

interface TooltipWrapperProps {
  text: string | React.JSX.Element;
  delay?: number | undefined;
  placement?: TooltipProps['placement'] | undefined;
  // <button> ではなく React Aria の <Button>
  hasButton?: boolean;
  children: React.JSX.Element;
  className?: string | undefined;
  fillColor: 'teal.400' | 'orange.400' | 'rose.500' | 'violet.500';
}

export default function TooltipWrapper({
  text,
  delay = 0,
  placement = 'bottom',
  hasButton = false,
  children,
  className = undefined,
  fillColor,
}: TooltipWrapperProps) {
  const color = {
    'teal.400': ['#2dd4bf', 'rgba(255, 255, 255, 0.3) 1px 1px'],
    'orange.400': ['#fb923c', 'rgba(255, 255, 255, 0.3) 1px 1px'],
    'rose.500': ['#f43f5e', 'rgba(0, 0, 0, 0.2) 1px 1px'],
    'violet.500': ['#8b5cf6', 'rgba(0, 0, 0, 0.2) 1px 1px'],
  };

  return (
    <TooltipTrigger delay={delay}>
      {hasButton
        ? children
        : (
            <Focusable>
              <span role="button">{children}</span>
            </Focusable>
          )}
      <Tooltip
        placement={placement}
        className={`react-aria-Tooltip ${className}`}
        style={{
          '--shades-of-shadow': color[fillColor][1],
        } as React.CSSProperties}
      >
        <OverlayArrow>
          <svg width={8} height={8} viewBox="0 0 8 8" fill={color[fillColor][0]}>
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        <span className={css({ textShadow: 'var(--shades-of-shadow)' })}>
          {text}
        </span>
      </Tooltip>
    </TooltipTrigger>
  );
}
