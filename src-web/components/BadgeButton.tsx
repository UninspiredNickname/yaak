import classNames from 'classnames';
import { forwardRef } from 'react';
import type { ButtonProps } from './core/Button';
import { Button } from './core/Button';

type Props = Omit<ButtonProps, 'size' | 'variant'>;

export const BadgeButton = forwardRef<HTMLButtonElement, Props>(function BadgeButton(
  { className, ...props }: Props,
  ref,
) {
  return (
    <Button
      ref={ref}
      size="2xs"
      variant="border"
      className={classNames(className, '!rounded-full mx-1')}
      {...props}
    />
  );
});
