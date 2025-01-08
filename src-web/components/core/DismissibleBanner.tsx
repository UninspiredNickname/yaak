import classNames from 'classnames';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { BannerProps } from './Banner';
import { Banner } from './Banner';
import { IconButton } from './IconButton';

type Props = BannerProps & {
  stateKey: string;
};

const stateAtom = atomWithStorage<Record<string, boolean>>('dismissedBanners', {});

export function DismissibleBanner({ color, stateKey, children, className, ...props }: Props) {
  const [state, setState] = useAtom(stateAtom);

  if (state[stateKey]) {
    // Return something, so this component can be easily used with CSS grid components
    return <span aria-hidden />;
  }

  return (
    <Banner className={classNames(className, 'relative pr-4')} color={color} {...props}>
      <IconButton
        title="Dismiss alert"
        icon="x"
        size="sm"
        color={color}
        variant="border"
        className="!absolute !border-0 top-0 right-0 mt-1 mr-0.5"
        onClick={() => setState((prev) => ({ ...prev, [stateKey]: true }))}
      />
      {/* Pad the children so the close button doesn't cover anything up */}
      {children}
    </Banner>
  );
}
