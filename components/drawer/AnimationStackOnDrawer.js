import React from "react"
import { View, StyleSheet, Platform } from "react-native"
import { StyleService, useStyleSheet } from "@ui-kitten/components"
import { createDrawerNavigator } from "@react-navigation/drawer"
import Animated from "react-native-reanimated"
import Screen from "./Screen"
import CustomDrawer from "./CustomDrawer"

const { interpolateNode, Extrapolate } = Animated

const Drawer = createDrawerNavigator()

let screenStyle = null

const AnimateStackOnDrawerToggle = ({ stackScreens }) => {
  const styles = useStyleSheet(themedStyles)
  return Platform.OS == "ios" ? (
    <View style={styles.backgroundImage}>
      <View style={styles.transparentView}>
        <Drawer.Navigator
          initialRouteName="Study"
          drawerType="back"
          overlayColor="transparent"
          screenOptions={{ headerShown: false }}
          sceneContainerStyle={styles.sceneContainerStyle}
          drawerStyle={styles.drawerStyle}
          drawerContent={props => {
            const scale = interpolateNode(props.progress, {
              inputRange: [0, 1],
              outputRange: [1, 0.8],
              extrapolate: Extrapolate.CLAMP
            })
            const borderRadius = interpolateNode(props.progress, {
              inputRange: [0, 1],
              outputRange: [0, 30],
              extrapolate: Extrapolate.CLAMP
            })
            screenStyle = {
              transform: [
                {
                  scaleY: scale
                }
              ],
              borderRadius
            }
            return <CustomDrawer {...props} />
          }}
        >
          {stackScreens.map(screen => {
            return (
              <Drawer.Screen
                key={screen.id}
                name={screen.name}
                options={{
                  drawerIcon: screen.icon,
                  show: screen.show
                }}
              >
                {props => (
                  <Screen
                    {...props}
                    name={screen.name}
                    style={{ ...screenStyle }}
                    component={screen.component}
                  />
                )}
              </Drawer.Screen>
            )
          })}
        </Drawer.Navigator>
      </View>
    </View>
  ) : (
    <View style={styles.backgroundImage}>
      <View style={styles.transparentView}>
        <Drawer.Navigator
          initialRouteName="Study"
          drawerType="back"
          overlayColor="transparent"
          screenOptions={{ headerShown: false }}
          sceneContainerStyle={styles.sceneContainerStyle}
          drawerStyle={styles.drawerStyle}
          drawerContent={props => <CustomDrawer {...props} />}
        >
          {stackScreens.map(screen => {
            return (
              <Drawer.Screen
                key={screen.id}
                name={screen.name}
                options={{
                  drawerIcon: screen.icon,
                  show: screen.show
                }}
              >
                {props => (
                  <Screen
                    {...props}
                    name={screen.name}
                    style={{ ...screenStyle }}
                    component={screen.component}
                  />
                )}
              </Drawer.Screen>
            )
          })}
        </Drawer.Navigator>
      </View>
    </View>
  )
}

const themedStyles = StyleService.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000"
  },
  transparentView: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "color-primary-500"
  },
  drawerStyle: {
    backgroundColor: "transparent",
    width: "65%"
  },
  sceneContainerStyle: {
    backgroundColor: "transparent"
  }
})

export default AnimateStackOnDrawerToggle
