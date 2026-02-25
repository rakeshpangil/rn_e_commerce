/**
 * Entry point for React Native.
 *
 * IMPORTANT: 'react-native-gesture-handler' MUST be the very FIRST import.
 * It patches the gesture system before anything else loads.
 */
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
