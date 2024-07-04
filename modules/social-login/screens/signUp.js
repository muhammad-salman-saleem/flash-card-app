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
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSelector, useDispatch } from "react-redux"
import { validateEmail } from "./constants"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"

import {
  Text,
  useStyleSheet,
  Button,
  Input,
  StyleService,
  useTheme
} from "@ui-kitten/components"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useFocusEffect } from "@react-navigation/native"
import { LoginManager, AccessToken } from "react-native-fbsdk-next"
import { appleAuth } from "@invertase/react-native-apple-authentication"
import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin"

import {
  signupRequest,
  resetMessages,
  getAuthUser,
  facebookLogin,
  googleLogin,
  appleLogin
} from "../auth"
import { unwrapResult } from "@reduxjs/toolkit"
import { SafeAreaView, ScrollView } from "react-native"
import { isIphoneWithNotch } from "../../utils"
import { setAuthToken } from "../../httpClient"
import PasswordField from "../../../components/passwordField"

const { width, height } = Dimensions.get("screen")

const SignIn = ({ navigation }) => {
  const styles = useStyleSheet(themedStyles)
  const theme = useTheme()
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: ""
  })
  const [validationError, setValidationError] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: ""
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

    if (label === "name" && !text) errors.name = "Please enter a valid name"

    if (label === "confirm_password" && !text)
      errors.confirm_password = "Please enter a valid password"

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

    if (values.password.length < 8)
      errors.password = "Password must be 8 characters long."
    if (!values.password) errors.password = "Please enter a valid password"
    if (!values.name) errors.name = "Please enter a valid name"
    if (!values.confirm_password)
      errors.confirm_password = "Please enter a valid password"

    if (values.confirm_password !== values.password)
      errors.confirm_password = "Password does not match"

    setValidationError({
      ...validationError,
      ...errors
    })

    if (Object.keys(errors).length === 0) {
      let { confirm_password, ...rest } = values
      dispatch(signupRequest(rest))
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
              <Text category="h2">Start Studying</Text>
            </View>
            <View style={{ paddingHorizontal: 25 }}>
              <Input
                placeholder="Enter Name"
                onChangeText={value => onChangeText("name", value)}
                value={values.name}
                error={validationError.name}
                status={validationError.name ? "danger" : ""}
                caption={validationError.name}
                accessoryLeft={() => (
                  <Ionicons name="person" size={24} color="#656E78" />
                )}
                style={styles.input}
              />
              <Input
                keyboardType="email-address"
                label=""
                placeholder="Enter Email Address"
                onChangeText={value => onChangeText("email", value)}
                value={values.email}
                error={validationError.email}
                caption={validationError.email}
                status={validationError.email ? "danger" : ""}
                autoCapitalize="none"
                accessoryLeft={() => (
                  <Ionicons name="mail" size={24} color="#656E78" />
                )}
                style={styles.input}
              />
              <PasswordField
                placeholder="Enter Password"
                fieldKey="password"
                onChange={onChangeText}
                value={values}
                error={validationError.password}
                style={styles.input}
              />

              <PasswordField
                placeholder="Confirm Password"
                fieldKey="confirm_password"
                onChange={onChangeText}
                value={values}
                error={validationError.confirm_password}
                style={styles.input}
              />
              {!!api.error && (
                <Text status="danger" style={styles.error}>
                  {api.error.message}
                </Text>
              )}
            </View>
            <View style={{ marginVertical: 20, marginHorizontal: 25 }}>
              <Button
                disabled={api?.loading}
                onPress={onSigninPress}
                style={styles.btn}
                accessoryLeft={() =>
                  api.loading ? (
                    <ActivityIndicator
                      size="small"
                      color={theme["color-basic-transparent-600"]}
                    />
                  ) : null
                }
              >
                CREATE AN ACCOUNT
              </Button>
            </View>
          </ImageBackground>
          {/* <SafeAreaView style={{ flex: 1 }} /> */}
          <View style={styles.signUpButtonContent}>
            <View style={styles.socialContent}>
              <View style={styles.dividerContent}>
                <View style={styles.divider} />
                <Text status="primary" category="s1">
                  Or sign up with
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

              {/* <View style={styles.signUpButtonContent}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                navigation.navigate("SignUpScreen")
                            }}
                        >
                            <Text>Don't have an account? <Text status="primary" category="s1"> Sign Up</Text></Text>
                        </TouchableOpacity>
                    </View> */}
              <View style={styles.signUpButtonContent}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate("SignInScreen")
                  }}
                >
                  <Text>
                    Already have an account?{" "}
                    <Text status="primary" category="s1">
                      {" "}
                      Sign In
                    </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate("FAQScreen")
                  }}
                  style={{ marginTop: 5 }}
                >
                  <Text>
                    Need help?{" "}
                    <Text status="primary" category="s1">
                      {" "}
                      FAQ
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
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
    paddingVertical: height < 678 ? 25 : 25
  },
  bgImage: {
    width,
    height: (height / 5) * 3.3
  },
  socialContent: {
    backgroundColor: "#ffff",
    width,
    height: (height / 5) * 1.1
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
    marginVertical: 5
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
    justifyContent: "space-evenly",
    marginVertical: 10
  },
  socialBtn: {
    width: 90
  },
  signUpButtonContent: {
    alignItems: "center"
  },
  error: {
    marginTop: 10
  }
})
