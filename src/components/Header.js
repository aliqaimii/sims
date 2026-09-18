import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, elevation } from '../theme';

/**
 * The app bar shown on every screen. Replaces react-native-elements' <Header>,
 * which was dropped in the RN 0.84 upgrade, and keeps the props the screens
 * already pass: title, rightIcon (a Material Icons name), go (press handler)
 * and backGroundColor.
 */
const MyHeader = props => {
  // Android 15 (targetSdk 36) and iOS notches both draw edge-to-edge, so the
  // bar has to pad itself past the status bar.
  const insets = useSafeAreaInsets();
  const background = props.backGroundColor || colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
          paddingTop: insets.top,
          height: HEADER_HEIGHT + insets.top,
        },
      ]}>
      <Text style={styles.title} numberOfLines={1}>
        {props.title}
      </Text>

      {props.rightIcon ? (
        <TouchableOpacity
          onPress={props.go}
          hitSlop={HIT_SLOP}
          style={styles.action}
          accessibilityRole="button">
          <MaterialIcons
            name={props.rightIcon}
            color={colors.onPrimary}
            size={24}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const HEADER_HEIGHT = 56;
const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    ...elevation.medium,
  },
  title: {
    flex: 1,
    color: colors.onPrimary,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  action: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyHeader;
