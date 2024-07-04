import React from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  View
  //   Platform
} from "react-native"
import { Text, Divider } from "@ui-kitten/components"
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer"
import Animated from "react-native-reanimated"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { SafeAreaView } from "react-native-safe-area-context"
import { TouchableOpacity } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import Logout from "../icons/Logout"
import { logoutRequest } from "@modules/social-login/auth"
import { unwrapResult } from "@reduxjs/toolkit"
import { setAuthToken } from "../../modules/httpClient"
import { Platform } from "react-native"
import { rateApp } from "../../modules/utils"

const { interpolateNode, Extrapolate } = Animated

export default props => {
  const { state, progress, navigation, descriptors } = props
  const { index, routes } = state

  const opacity = interpolateNode(progress, {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.1, 1],
    extrapolate: Extrapolate.CLAMP
  })

  const user = useSelector(state => state.login.user)
  const api = useSelector(state => state.login?.api)

  const dispatch = useDispatch()

  const signOutPressed = () => {
    dispatch(logoutRequest())
      .then(unwrapResult)
      .then(res => {
        setAuthToken("")
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  return (
    <View style={{ backgroundColor: "#F78171" }}>
      <SafeAreaView edges={["top"]}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Image
            source={require("@assets/images/close.png")}
            style={styles.closeBtn}
          />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image
            source={
              user?.profile_image
                ? { uri: user?.profile_image }
                : require("@assets/images/avatar.jpeg")
            }
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={{ color: "#ffff" }} category="h6">
            {user?.name}
          </Text>
          <Pressable
            style={{ marginTop: 8 }}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={{ color: "#ffff" }}>View your profile</Text>
          </Pressable>
        </View>
        <Divider
          style={[styles.divider, { marginTop: 20, marginBottom: 30 }]}
        />
      </SafeAreaView>
      <View style={{ minHeight: "100%" }}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.drawerContentContainerStyle}
        >
          {routes.map((route, position) => {
            const isFocused = index === position
            if (!descriptors[route.key]?.options?.show) return null
            return (
              <DrawerItem
                key={route.key}
                label={({ focused }) => {
                  return (
                    <Text
                      style={focused ? styles.activeText : styles.inactiveText}
                    >
                      {route.name}
                    </Text>
                  )
                }}
                icon={descriptors[route.key]?.options?.drawerIcon}
                style={
                  isFocused ? styles.activeContainer : styles.inActiveContainer
                }
                onPress={() => navigation.navigate(`${route.name}`)}
                focused={isFocused}
                activeBackgroundColor="transparent"
              />
            )
          })}
          <DrawerItem
            key={"rateTheApp"}
            label={({ focused }) => {
              return (
                <Text style={focused ? styles.activeText : styles.inactiveText}>
                  {"Rate the App"}
                </Text>
              )
            }}
            icon={() => (
              <Image source={require("@assets/images/drawerIcon/rate.png")} />
            )}
            style={
              index === routes.length
                ? styles.activeContainer
                : styles.inActiveContainer
            }
            onPress={() => {
              rateApp()
              navigation.toggleDrawer()
            }}
            focused={index === routes.length}
            activeBackgroundColor="transparent"
          />
        </DrawerContentScrollView>
        <View style={{ flexGrow: 1 }}>
          <Divider
            style={[
              styles.divider,
              {
                marginTop: Platform.OS === "android" ? 20 : 0,
                marginBottom: 30
              }
            ]}
          />
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={signOutPressed}
          >
            {api.loading ? <ActivityIndicator color="white" /> : <Logout />}
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
  // )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  drawerContentContainerStyle: {
    paddingTop: 0
  },

  divider: {
    width: wp(62),
    backgroundColor: "#f5f5f580"
  },

  logoutButton: {
    marginLeft: wp(5),
    flexDirection: "row",
    alignItems: "center"
  },

  signOutText: {
    color: "rgba(255,255,255,0.8)",
    marginLeft: 16,
    fontWeight: "bold"
  },

  imageContainer: {
    alignItems: "center",
    borderRadius: wp(16),
    marginVertical: wp(4)
  },

  profileImage: {
    borderWidth: 1,
    borderColor: "#ffff",
    borderRadius: wp(20) / 2,
    width: wp(20),
    height: wp(20),
    marginBottom: 10
  },

  imageGradient: {
    flex: 1,
    borderRadius: wp(16)
  },

  activeContainer: {
    borderLeftWidth: wp(1.06),
    borderLeftColor: "#ffff",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: wp(0.8),
    marginTop: 0
  },

  activeText: {
    marginLeft: -15,
    fontWeight: "bold",
    color: "#ffff",
    backgroundColor: "transparent"
  },

  inActiveContainer: {
    borderLeftWidth: wp(1.06),
    borderLeftColor: "transparent",
    backgroundColor: "transparent",
    borderRadius: wp(0.8),
    marginTop: 0
  },

  inactiveText: {
    marginLeft: -15,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "transparent"
  },
  closeBtn: {
    height: wp(4),
    width: wp(4),
    marginLeft: wp(5),
    marginTop: wp(3)
  }
})
