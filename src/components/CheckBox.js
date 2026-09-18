import React from 'react';
import { Checkbox } from 'react-native-paper';

/**
 * Drop-in replacement for the CheckBox that used to ship with React Native
 * core (removed in 0.62), backed by react-native-paper's Checkbox so the app
 * keeps the `value` / `onValueChange` props the screens were written against
 * without pulling in another native dependency.
 */
export default function CheckBox({ value, onValueChange, disabled, color }) {
  return (
    <Checkbox
      status={value ? 'checked' : 'unchecked'}
      onPress={() => onValueChange && onValueChange(!value)}
      disabled={disabled}
      color={color}
    />
  );
}
