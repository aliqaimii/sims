import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, radius, spacing } from '../theme';

const isIOS = Platform.OS === 'ios';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const pad = n => String(n).padStart(2, '0');

/** Only the DD-MMM-YYYY format the screens actually use is supported. */
export const formatDate = date =>
  `${pad(date.getDate())}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;

const parseDate = value => {
  if (!value) {
    return new Date();
  }
  const [day, month, year] = String(value).split('-');
  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex === -1 || !day || !year) {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }
  return new Date(Number(year), monthIndex, Number(day));
};

/**
 * Replaces react-native-datepicker (abandoned in 2018, incompatible with RN
 * 0.84) with @react-native-community/datetimepicker behind the same prop API
 * the screens already use: date, placeholder, minDate, maxDate, onDateChange.
 * `format`, `mode`, `confirmBtnText`, `cancelBtnText` and `customStyles` are
 * accepted and ignored — the platform picker provides those itself.
 *
 * The two platforms need different lifecycles: on Android the picker is a modal
 * dialog that dismisses itself after one selection, while on iOS it is an
 * inline spinner that has to stay mounted until the user confirms.
 */
const DatePicker = ({ style, date, placeholder = 'select date', minDate, maxDate, onDateChange }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (event, selected) => {
    if (!isIOS) {
      // Android's dialog closes itself; mirror that in our state.
      setOpen(false);
    }
    if (event.type === 'dismissed' || !selected) {
      return;
    }
    onDateChange && onDateChange(formatDate(selected), selected);
  };

  return (
    <View style={style}>
      <TouchableOpacity style={styles.field} onPress={() => setOpen(!open)}>
        <MaterialIcons name="event" size={24} color={colors.primary} />
        <Text style={date ? styles.value : styles.placeholder}>
          {date || placeholder}
        </Text>
      </TouchableOpacity>

      {open && (
        <View>
          <RNDateTimePicker
            value={parseDate(date)}
            mode="date"
            display={isIOS ? 'inline' : 'default'}
            minimumDate={minDate ? parseDate(minDate) : undefined}
            maximumDate={maxDate ? parseDate(maxDate) : undefined}
            onChange={handleChange}
          />

          {isIOS && (
            <TouchableOpacity style={styles.done} onPress={() => setOpen(false)}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  value: { flex: 1, textAlign: 'center', fontSize: 16, color: colors.textPrimary },
  placeholder: { flex: 1, textAlign: 'center', fontSize: 16, color: colors.textMuted },
  done: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  doneText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});

export default DatePicker;
