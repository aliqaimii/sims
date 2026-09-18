import { MD3LightTheme } from 'react-native-paper';
import { colors } from './index';

/**
 * Feeds the design tokens into react-native-paper so its TextInput, Snackbar,
 * Modal, FAB and Checkbox pick up the brand green instead of Paper's default
 * purple — which is what made the form screens look like two different apps.
 */
export const paperTheme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: colors.primarySurface,
    onPrimaryContainer: colors.primaryDark,
    secondary: colors.primaryDark,
    onSecondary: colors.onPrimary,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceAlt,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
    outlineVariant: colors.divider,
    error: colors.danger,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: colors.surface,
      level2: colors.surface,
      level3: colors.surface,
    },
  },
};

export default paperTheme;
