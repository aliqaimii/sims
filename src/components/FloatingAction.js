import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { colors, spacing, elevation } from '../theme';

/**
 * Replaces react-native-floating-action (unmaintained since 2022) with
 * react-native-paper's FAB. The screens only ever use it as a single
 * bottom-right "add" button, so only `color`, `onPressMain` and `style`
 * are supported — the action-list props were never used.
 */
export const FloatingAction = ({ color = colors.primary, onPressMain, style }) => (
  <FAB
    icon="plus"
    color={colors.onPrimary}
    style={[styles.fab, { backgroundColor: color }, style]}
    onPress={onPressMain}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    borderRadius: 28,
    ...elevation.medium,
  },
});

export default FloatingAction;
