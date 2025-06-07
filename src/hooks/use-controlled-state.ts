import { useState } from 'react';

/**
 * A React hook that provides controlled/uncontrolled behavior for a component's state.
 *
 * - If a `controlledValue` is provided (not `undefined`), the component is considered controlled,
 *   and the state mirrors the `controlledValue`.
 * - If no `controlledValue` is provided, the hook falls back to internal state.
 *
 * @template T - The type of the value being controlled.
 *
 * @param {T | undefined} controlledValue - The external value (from props) to control the state. If `undefined`, the hook uses internal state.
 * @param {(value: T) => void} [onChange] - Optional callback that is called whenever the value changes.
 * @param {T} [defaultValue] - The initial internal value if the component is uncontrolled.
 *
 * @returns {[T, (value: T) => void]} A tuple containing the current value and a setter function.
 *
 * @example
 * const [count, setCount] = useControlledState(props.count, props.onCountChange, 0);
 */
export function useControlledState<T>(
  controlledValue: T | undefined,
  onChange?: (value: T) => void,
  defaultValue?: T
): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue as T);

  const isControlled = controlledValue !== undefined;

  const value = isControlled ? controlledValue : internalValue;
  const setValue = (newValue: T) => {
    if (onChange) onChange(newValue);
    if (!isControlled) setInternalValue(newValue);
  };

  return [value, setValue];
}
