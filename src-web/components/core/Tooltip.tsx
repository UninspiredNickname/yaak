import classNames from 'classnames';
import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties, HTMLAttributes, MouseEvent, ReactElement, ReactNode } from 'react';
import React, { Children, cloneElement, useMemo, useRef } from 'react';
import { useDebouncedState } from '../../hooks/useDebouncedState';
import { generateId } from '../../lib/generateId';
import { Portal } from '../Portal';

interface Props {
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  message: ReactNode;
  side?: 'above' | 'below';
}

export function Tooltip({ children, message, side = 'above' }: Props) {
  console.warn('The <Tooltip> component is not ready to use, as it does not place the tooltip in the correct place');
  const [isHovered, debouncedSetIsHovered, setIsHovered] = useDebouncedState<boolean>(false);

  const id = useRef(`tooltip-${generateId()}`).current;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const styles = useMemo(() => {
    if (!isHovered) return;

    const containerShape = containerRef.current?.getBoundingClientRect();
    const tooltipShape = containerRef.current?.getBoundingClientRect();
    const docShape = document.body.getBoundingClientRect();
    if (containerShape == null || tooltipShape == null) return;

    const desiredWidth = 250;

    const styles: CSSProperties = {
      left: containerShape.left + containerShape.width / 2 - desiredWidth / 2,
      right: containerShape.right + containerShape.width / 2 - desiredWidth / 2,
      top: side === 'below' ? containerShape.bottom : undefined,
      bottom: side === 'above' ? docShape.height - containerShape.top : undefined,
    };

    return styles;
  }, [isHovered, side]);

  const triangleStyles: CSSProperties = {
    width: '0.4rem',
    height: '0.4rem',
    ...(side == 'above'
      ? { bottom: '-0.3rem', rotate: '225deg' }
      : { top: '-0.3rem', rotate: '45deg' }),
  };

  const child = useMemo(() => {
    const existingChild = Children.only(children);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = {
      ...existingChild.props,
      ref: containerRef,
      'aria-describedby': id,
      onMouseEnter(e: MouseEvent<HTMLElement>) {
        existingChild.props.onMouseEnter?.(e);
        debouncedSetIsHovered(true);
      },
      onMouseLeave(e: MouseEvent<HTMLElement>) {
        existingChild.props.onMouseLeave?.(e);
        setIsHovered(false);
      },
    };
    return cloneElement(existingChild, props);
  }, [children, debouncedSetIsHovered, id, setIsHovered]);

  return (
    <>
      <Portal name={`portal-${id}`}>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              id={id}
              role="tooltip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 100 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={styles}
              className="absolute bottom-full z-[99999] pointer-events-none text-sm"
            >
              <div
                ref={tooltipRef}
                className={classNames(
                  'bg-surface-highlight text-base font-normal relative px-1 border border-border rounded',
                  'margin-auto',
                  side === 'above' && '-top-[0.35rem]',
                  side === 'below' && 'top-[0.35rem]',
                )}
              >
                {message}
                <div aria-hidden className="text-center">
                  <span
                    aria-hidden
                    style={triangleStyles}
                    className="bg-surface-highlight absolute border-border-subtle border-t border-l"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
      {child}
    </>
  );
}
