import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme';

/**
 * Inline "add" affordance used on the empty states.
 *
 * The icon was named "ios-add-circle", which Ionicons 5 (shipped with
 * vector-icons 10) removed along with every other ios-/md- prefixed name — it
 * rendered as a blank box after the upgrade.
 */
const AddButton = props => (
  <View
    style={[
      styles.wrapper,
      {
        marginBottom: props.Mb,
        marginLeft: props.Ml,
        marginTop: props.Mt,
      },
    ]}>
    <Icon
      name="add-circle"
      size={64}
      color={colors.primary}
      onPress={props.go}
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
});

export default AddButton;
