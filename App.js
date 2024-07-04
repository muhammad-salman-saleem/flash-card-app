import React, { useEffect } from "react";
import { Provider } from "react-redux";
import "react-native-gesture-handler";
import { ApplicationProvider } from '@ui-kitten/components';
import { mapping } from '@eva-design/eva';
import Navigation from './Navigator'
import { crowdboticsTheme } from './config/crowdboticsTheme';
import { default as customMapping } from './config/mapping.json';
import { getStore } from './store'
import { LogBox } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  iosClientId: '133072641319-gcogj5q7i5tlo27ugcrsq6g3chva1i6k.apps.googleusercontent.com',
  webClientId: "133072641319-fble1bbcgm2crd6rkjipi3b5gfg4qdje.apps.googleusercontent.com"
});


LogBox.ignoreAllLogs(true);

const App = () => {
  const store = getStore();

  return (
    <Provider store={store}>
      <ApplicationProvider
        mapping={mapping}
        customMapping={customMapping}
        theme={crowdboticsTheme}>
        <Navigation />
      </ApplicationProvider>
    </Provider>
  );
};

export default App;
