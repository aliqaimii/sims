import React from 'react';
import { LogBox, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import My_Switch_Navigator from './navigations/SwitchNavigation';
import { colors } from './theme';
import { paperTheme } from './theme/paperTheme';

// console.disableYellowBox was removed from React Native; LogBox replaces it.
LogBox.ignoreAllLogs();

export default function App() {
  // GestureHandlerRootView: react-native-gesture-handler 3 refuses to recognise
  // gestures outside one, and several screens import its ScrollView.
  // PaperProvider: react-native-paper 5 reads its theme from context, which the
  // TextInput, Snackbar, Modal, FAB and Checkbox components here all rely on.
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
          <My_Switch_Navigator />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
