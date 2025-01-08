import { useCallback, useRef, useState } from 'react';

export function useDebouncedState<T>(
  defaultValue: T,
  delay = 500,
): [T, (v: T) => void, (v: T) => void] {
  const [state, setState] = useState<T>(defaultValue);
  const timeout = useRef<NodeJS.Timeout>();
  const debouncedSetState = useCallback(
    (v: T) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setState(v), delay);
    },
    [delay],
  );
  const immediateSetState = useCallback((v: T) => {
    clearTimeout(timeout.current);
    setState(v);
  }, []);
  return [state, debouncedSetState, immediateSetState];
}
