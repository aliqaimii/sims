/**
 * @format
 */

// Must stay first: react-native-gesture-handler requires it at the entry point.
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
