/**
 * Shared UI primitives.
 *
 * These encode the Home dashboard's visual language — tinted page, white cards
 * with hairline borders, icon chips, quiet section labels, right-aligned
 * values — so the other screens can reuse it instead of restyling by hand.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyHeader from './Header';
import { colors, spacing, radius, typography, elevation } from '../theme';

/** Page frame: header + tinted background. */
export const Screen = ({
  title,
  rightIcon,
  onRightPress,
  scroll = false,
  contentStyle,
  children,
}) => {
  const Body = scroll ? ScrollView : View;
  return (
    <View style={styles.screen}>
      <MyHeader
        title={title}
        rightIcon={rightIcon}
        go={onRightPress}
        backGroundColor={colors.primary}
      />
      <Body
        style={scroll ? undefined : styles.body}
        contentContainerStyle={scroll ? [styles.scrollBody, contentStyle] : contentStyle}>
        {children}
      </Body>
    </View>
  );
};

/** Quiet uppercase group heading. */
export const SectionLabel = ({ children, style }) => (
  <Text style={[styles.sectionLabel, style]}>{children}</Text>
);

/** White surface with a hairline border and a soft lift. */
export const Card = ({ style, children, padded = true }) => (
  <View style={[styles.card, padded && styles.cardPadded, style]}>{children}</View>
);

/** Circular tinted icon container. */
export const IconChip = ({ name, size = 22, chipSize = 48, color = colors.primary, style }) => (
  <View
    style={[
      styles.chip,
      { width: chipSize, height: chipSize, borderRadius: chipSize / 2 },
      style,
    ]}>
    <MaterialCommunityIcons name={name} size={size} color={color} />
  </View>
);

/** Column header for a data list. */
export const TableHeader = ({ columns }) => (
  <View style={styles.tableHeader}>
    {columns.map((c, i) => (
      <Text
        key={i}
        style={[
          styles.tableHeaderText,
          { width: c.width, textAlign: c.align || 'left' },
        ]}
        numberOfLines={1}>
        {c.title}
      </Text>
    ))}
  </View>
);

/** One tappable data row. `index` drives the zebra tint. */
export const TableRow = ({ cells, index = 0, onPress, onLongPress }) => (
  <TouchableOpacity
    style={[styles.row, index % 2 === 1 && styles.rowAlt]}
    onPress={onPress}
    onLongPress={onLongPress}
    activeOpacity={0.6}>
    {cells.map((c, i) => (
      <Text
        key={i}
        style={[
          c.strong ? styles.cellStrong : styles.cell,
          { width: c.width, textAlign: c.align || 'left' },
        ]}
        numberOfLines={1}>
        {c.text}
      </Text>
    ))}
  </TouchableOpacity>
);

/** "Nothing here yet" placeholder with a single call to action. */
export const EmptyState = ({ icon = 'inbox-outline', title, message, actionLabel, onAction }) => (
  <View style={styles.empty}>
    <IconChip name={icon} size={34} chipSize={80} />
    <Text style={styles.emptyTitle}>{title}</Text>
    {message ? <Text style={styles.emptyMessage}>{message}</Text> : null}
    {actionLabel ? (
      <TouchableOpacity style={styles.emptyAction} onPress={onAction} activeOpacity={0.8}>
        <Text style={styles.emptyActionText}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

/** Filled / outlined action button. */
export const Button = ({ label, onPress, variant = 'primary', style, disabled }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'secondary' && styles.buttonSecondary,
      disabled && styles.buttonDisabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}>
    <Text
      style={[styles.buttonText, variant === 'secondary' && styles.buttonTextSecondary]}>
      {label}
    </Text>
  </TouchableOpacity>
);

/** Label + value line used on the detail/summary screens. */
export const DetailRow = ({ label, value, last }) => (
  <View style={[styles.detailRow, last && styles.detailRowLast]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  scrollBody: { padding: spacing.lg, paddingBottom: spacing.xxl },

  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.low,
  },
  cardPadded: { padding: spacing.lg },

  chip: {
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tableHeaderText: {
    ...typography.label,
    color: colors.onPrimary,
    fontSize: 13,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowAlt: { backgroundColor: colors.surfaceAlt },
  cell: { ...typography.body, color: colors.textSecondary },
  cellStrong: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.subtitle,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptyMessage: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyAction: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    ...elevation.low,
  },
  emptyActionText: { color: colors.onPrimary, fontSize: 15, fontWeight: '600' },

  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.low,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
  buttonTextSecondary: { color: colors.primary },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailRowLast: { borderBottomWidth: 0 },
  detailLabel: { ...typography.body, color: colors.textSecondary, flex: 1 },
  detailValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});

export default {
  Screen,
  SectionLabel,
  Card,
  IconChip,
  TableHeader,
  TableRow,
  EmptyState,
  Button,
  DetailRow,
};
