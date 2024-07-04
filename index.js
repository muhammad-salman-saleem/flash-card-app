/**
 * @format
 */

import { AppRegistry, Text, TextInput } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Input } from "@ui-kitten/components"

AppRegistry.registerComponent(appName, () => App);

//ADD this 
if (Text.defaultProps == null) {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
    TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
}

if (Input.defaultProps == null) {
    Input.defaultProps = {};
    Input.defaultProps.allowFontScaling = false;
}

