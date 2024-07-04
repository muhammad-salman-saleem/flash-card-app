import React, { useState } from "react"
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Platform,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useSelector, useDispatch } from "react-redux"
import { useFocusEffect } from "@react-navigation/native"
import { validateEmail } from "./constants"
import {
  Text,
  useStyleSheet,
  Button,
  Input,
  StyleService,
  useTheme
} from "@ui-kitten/components"
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LoginManager, AccessToken } from "react-native-fbsdk-next"
import { appleAuth } from "@invertase/react-native-apple-authentication"
import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin"

import {
  loginRequest,
  facebookLogin,
  googleLogin,
  appleLogin,
  getAuthUser,
  resetMessages
} from "../auth"
import { unwrapResult } from "@reduxjs/toolkit"
import { SafeAreaView } from "react-native"
import { setAuthToken } from "../../httpClient"
import PasswordField from "../../../components/passwordField"

const { width, height } = Dimensions.get("screen")

const SignIn = ({ navigation }) => {
  const styles = useStyleSheet(themedStyles)
  const theme = useTheme()
  const [values, setValues] = useState({
    email: "",
    password: ""
  })
  const [validationError, setValidationError] = useState({
    email: "",
    password: ""
  })

  const api = useSelector(state => state.login?.api)
  const dispatch = useDispatch()

  useFocusEffect(
    React.useCallback(() => {
      dispatch(resetMessages())
    }, [])
  )

  const onChangeText = (label, text) => {
    let errors = {
      [label]: ""
    }

    if (label === "email") {
      text = text.trim()
    }

    if (label === "email" && !validateEmail.test(text))
      errors.email = "Please enter a valid email address."

    if (label === "password" && !text)
      errors.password = "Please enter a valid password"

    setValidationError({
      ...validationError,
      ...errors
    })
    setValues({
      ...values,
      [label]: text
    })
  }

  const onSigninPress = async () => {
    let errors = {}
    if (!validateEmail.test(values.email))
      errors.email = "Please enter a valid email address."

    if (!values.password) errors.password = "Please enter a valid password"

    setValidationError({
      ...validationError,
      ...errors
    })

    if (Object.keys(errors).length === 0) {
      let { confirm_password, ...rest } = values
      dispatch(loginRequest(rest))
        .then(unwrapResult)
        .then(res => {
          AsyncStorage.setItem("@token", JSON.stringify(res.key))
          setAuthToken(res.key)
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  }

  const onFBLogin = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Login cancelled")
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          )
          AccessToken.getCurrentAccessToken().then(data => {
            dispatch(
              facebookLogin({
                access_token: data.accessToken,
                code: data.userID
              })
            )
              .then(unwrapResult)
              .then(res => {
                AsyncStorage.setItem("@token", JSON.stringify(res.key))
                setAuthToken(res.key)
                dispatch(getAuthUser(res.key))
              })
              .catch(err => {
                console.log(err.message)
              })
          })
        }
      },
      function (error) {
        console.log("Login fail with error: " + error)
      }
    )
  }

  const onAppleButtonPress = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
    })
    if (appleAuthRequestResponse) {
      dispatch(
        appleLogin({
          id_token: appleAuthRequestResponse.identityToken,
          code: "",
          access_token: appleAuthRequestResponse.authorizationCode
        })
      )
        .then(unwrapResult)
        .then(res => {
          AsyncStorage.setItem("@token", JSON.stringify(res.key))
          setAuthToken(res.key)
          dispatch(getAuthUser(res.key))
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  }

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.signIn()
      const userInfo = await GoogleSignin.getTokens()
      dispatch(
        googleLogin({
          access_token: userInfo.accessToken,
          code: userInfo.idToken
        })
      )
        .then(unwrapResult)
        .then(res => {
          AsyncStorage.setItem("@token", JSON.stringify(res.key))
          setAuthToken(res.key)
          dispatch(getAuthUser(res.key))
        })
        .catch(err => {
          console.log(err.message)
        })
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid={true}
          extraHeight={80}
          enableAutomaticScroll={Platform.OS === "ios"}
        >
          <View style={styles.header} />
          <ImageBackground
            source={require("@assets/images/signInBg.png")}
            resizeMode="stretch"
            style={styles.bgImage}
          >
            <View style={styles.headerContent}>
              <Text category="h2">Sign In</Text>
            </View>
            <View style={{ paddingHorizontal: 25 }}>
              <Input
                keyboardType="email-address"
                label=""
                placeholder="Enter Email Address"
                onChangeText={value => onChangeText("email", value)}
                value={values.email}
                error={validationError.email}
                caption={validationError.email}
                autoCapitalize="none"
                status={validationError.email ? "danger" : ""}
                accessoryLeft={() => (
                  <Ionicons name="mail" size={24} color="#656E78" />
                )}
                style={styles.input}
              />
              <PasswordField
                placeholder="Enter Password"
                fieldKey="password"
                value={values}
                onChange={onChangeText}
                error={validationError.password}
                style={styles.input}
              />
              <View style={styles.forgetButtonContent}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate("ForgotPasswordScreen")
                  }}
                >
                  <Text status="primary" category="s1">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
              <Button
                disabled={api.loading}
                onPress={onSigninPress}
                accessoryLeft={() =>
                  api.loading && (
                    <ActivityIndicator
                      size="small"
                      color={theme["color-basic-transparent-600"]}
                    />
                  )
                }
              >
                {" "}
                SIGN IN{" "}
              </Button>
              {api.error && (
                <Text status="danger" style={styles.error}>
                  {api.error.message}
                </Text>
              )}
            </View>
          </ImageBackground>
          <View style={styles.socialContent}>
            <View style={styles.dividerContent}>
              <View style={styles.divider} />
              <Text status="primary" category="s1">
                Or
              </Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialButtonContent}>
              <Button
                status="basic"
                size="giant"
                style={styles.socialBtn}
                onPress={onFBLogin}
              >
                <FontAwesome5 name="facebook-f" size={24} color="#656E78" />
              </Button>
              <Button
                status="basic"
                size="giant"
                style={styles.socialBtn}
                onPress={googleSignIn}
              >
                <FontAwesome5 name="google" color="#656E78" size={24} />
              </Button>
              {Platform.OS === "ios" && (
                <Button
                  status="basic"
                  size="giant"
                  style={styles.socialBtn}
                  onPress={onAppleButtonPress}
                >
                  <FontAwesome5 name="apple" color="#656E78" size={24} />
                </Button>
              )}
            </View>

            <View style={styles.signUpButtonContent}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate("SignUpScreen")
                }}
              >
                <Text>
                  Don't have an account?{" "}
                  <Text status="primary" category="s1">
                    {" "}
                    Sign Up
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default SignIn

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4EFED",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  header: {
    height: 40
  },
  headerContent: {
    alignItems: "center",
    paddingVertical: height < 678 ? 25 : 50
  },
  bgImage: {
    width,
    height: (height / 5) * 3
  },
  socialContent: {
    backgroundColor: "#ffff",
    width,
    height: (height / 5) * 2
  },
  input: {
    marginBottom: 10
  },
  forgetButtonContent: {
    alignItems: "flex-end",
    marginBottom: 35
  },
  dividerContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30
  },
  divider: {
    width: width / 2 - 40,
    height: 0.5,
    marginLeft: 15,
    marginRight: 15,
    borderTopWidth: 0.5,
    borderColor: "#E4E4E4"
  },
  socialButtonContent: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  socialBtn: {
    width: 90
  },
  signUpButtonContent: {
    marginTop: 25,
    alignItems: "center"
  },
  error: {
    marginTop: 10
  }
})
