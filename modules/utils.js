import React from "react";
import { StyleSheet, View, Text, Dimensions, Platform, Linking } from "react-native";

const YourApp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to your brand new app!</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    padding: 13
  },
  text: {
    fontSize: 20
  },
})

const YourAppModule = {
  title: "Your App",
  navigator: YourApp
}

const sortNavigators = (a, b) => {
  if (a.hasOwnProperty("navigator") && b.hasOwnProperty("navigator")) {
    return 0;
  } else if (a.hasOwnProperty("navigator")) {
    return -1;
  } else {
    return 1;
  }
}

const sortMenu = (a, b) => {
  if (a.title == "App Menu") {
    return -1;
  } else {
    return 0;
  }
}

const validate = (mod, prop) => {
  return mod.hasOwnProperty(prop);
};

export const getModules = (manifest) => {
  let modules = [];
  for (const [name, definition] of Object.entries(manifest)) {
    if (definition && validate(definition, "title")) {
      modules.push(definition)
    } else {
      let title = name.replace(/([A-Z])/g, " $1");
      title = title.charAt(0).toUpperCase() + title.slice(1);
      modules.push({
        title: title,
        navigator: definition
      });
    }
  }
  modules = modules.sort(sortNavigators);
  modules = modules.sort(sortMenu);
  if (!(modules.length && modules[0].hasOwnProperty("navigator"))) {
    modules.splice(0, 0, YourAppModule);
  }
  return modules;
}

export function getPropertyMap(source, prop) {
  let map = {};
  source.map(mod => {
    if (mod[prop]) {
      map[mod.title] = mod[prop]
    }
  });
  return map;
}

export function isIphoneWithNotch() {
  const dim = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dim.height === 780 ||
      dim.width === 780 ||
      dim.height === 812 ||
      dim.width === 812 ||
      dim.height === 844 ||
      dim.width === 844 ||
      dim.height === 896 ||
      dim.width === 896 ||
      dim.height === 926 ||
      dim.width === 926)
  );
}

export function rateApp() {
  //TODO: replace IDs when live
  const APP_STORE_LINK = 'itms://itunes.apple.com/us/app/apple-store/myiosappid?mt=8';
  const PLAY_STORE_LINK = 'market://details?id=myandroidappid';
  if (Platform.OS != 'ios') {
    //To open the Google Play Store
    Linking.openURL(PLAY_STORE_LINK).catch(err => {
      console.log("ERROR Linking: ", err)
      return alert('Please check the app on the Google Play Store.')
    });
  } else {
    //To open the Apple App Store
    Linking.openURL(APP_STORE_LINK).catch(err => {
      console.log("ERROR Linking: ", err)
      alert('Please check the app on the App Store.')
    });
  }
}
