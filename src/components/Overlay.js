import React from 'react';
import { Modal, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { colors, radius, spacing, elevation } from '../theme';

/**
 * Replaces react-native-elements' <Overlay>, which was dropped in the RN 0.84
 * upgrade. Keeps the prop names the screens already use: isVisible,
 * onBackdropPress, windowBackgroundColor, overlayBackgroundColor, width, height.
 */
const Overlay = ({
  isVisible,
  onBackdropPress,
  windowBackgroundColor = 'rgba(11, 31, 25, 0.45)',
  overlayBackgroundColor = colors.surface,
  width = 'auto',
  height = 'auto',
  children,
}) => {
  return (
    <Modal
      visible={!!isVisible}
      transparent
      animationType="fade"
      onRequestClose={onBackdropPress}>
      <TouchableWithoutFeedback onPress={onBackdropPress}>
        <View style={[styles.backdrop, { backgroundColor: windowBackgroundColor }]}>
          {/* Swallow taps inside the card so they don't dismiss the overlay. */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={[
                styles.card,
                { backgroundColor: overlayBackgroundColor, width, height },
              ]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    overflow: 'hidden',
    ...elevation.medium,
  },
});

export default Overlay;
