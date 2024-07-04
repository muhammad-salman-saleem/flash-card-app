import React, { useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import {
  View,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector, useDispatch } from "react-redux"
import { Text, useStyleSheet, Button, StyleService, useTheme } from '@ui-kitten/components';

import { resetPasswordConfirm, resetMessages } from "../auth"
import { unwrapResult } from "@reduxjs/toolkit"
import { SafeAreaView } from "react-native";
import { isIphoneWithNotch } from "../../utils";
import PasswordField from "../../../components/passwordField";

const { width, height } = Dimensions.get('screen')

const Reset = ({ navigation, route }) => {

  const params = route.params || {};
  const { token } = params;

  const styles = useStyleSheet(themedStyles);
  const theme = useTheme()
  const [new_password1, setNewPassword1] = useState("")
  const [new_password2, setNewPassword2] = useState("")

  const [validationError, setValidationError] = useState({
    new_password1: "",
    new_password2: ""
  })

  const { api } = useSelector(state => state.login)
  const { resetPasswordMessage } = useSelector(state => state.login)
  const dispatch = useDispatch()

  useFocusEffect(
    React.useCallback(() => {
      dispatch(resetMessages())
    }, [])
  );

  const onSigninPress = async () => {

    let errors = {
      new_password2: "",
      new_password1: ""
    };
    let isErrorDetected = false;
    if (!new_password1) {
      errors.new_password1 = "This field is required."
      isErrorDetected = true
    }

    if (!new_password2) {
      errors.new_password2 = "This field is required."
      isErrorDetected = true
    }

    if (new_password1 !== new_password2) {
      errors.new_password2 = "Password does not match."
      isErrorDetected = true
    }

    setValidationError({ ...errors })

    if (isErrorDetected) return
    //console.log({ password: new_password1, token })
    dispatch(resetPasswordConfirm({ password: new_password1, token }))
      .then(unwrapResult)
      .then(res => {
        if (res.status === 'OK') console.log('OK')
      })
      .catch(err => console.log(err))
  }

  const onPasswordChange = (key, value) => {
    if (key === 'new_password1') {
      setNewPassword1(value)
    }

    if (key === 'new_password2') {
      setNewPassword2(value)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid={true}
          extraHeight={80}
          enableAutomaticScroll={Platform.OS === 'ios'}
        >
          <View style={styles.header} />
          <ImageBackground source={require("@assets/images/signInBg.png")} resizeMode="stretch" style={styles.bgImage}>
            <View style={styles.headerContent}>
              <Text category="h2">Reset Password</Text>
            </View>

            <View style={{ paddingHorizontal: 25 }}>

              <PasswordField
                placeholder="Enter New Password"
                fieldKey="new_password1"
                onChange={onPasswordChange}
                value={{ new_password1 }}
                error={validationError.new_password1}
                style={styles.input}
              />

              <PasswordField
                placeholder="Confirm New Password"
                fieldKey="new_password2"
                onChange={onPasswordChange}
                value={{ new_password2 }}
                error={validationError.new_password2}
                style={styles.input}
              />

            </View>

            {resetPasswordMessage &&
              <View style={styles.successMessageContainer}>
                <Text status="success" style={styles.msg}>{resetPasswordMessage}</Text>
                <Button appearance='ghost' onPress={() => navigation.navigate("SignInScreen")} style={styles.signInBtn}>Sign In</Button>
              </View>
            }

            {api.error &&
              <Text status={'danger'} style={{ paddingHorizontal: 25 }}>{api.error}</Text>
            }

          </ImageBackground>
          <SafeAreaView style={{ flex: 1 }} />
          <View style={styles.signUpButtonContent}>
            <Button
              disabled={api.loading}
              loading={true}
              onPress={onSigninPress}
              style={styles.btn}
              accessoryLeft={() => api.loading && <ActivityIndicator size="small" color={theme["color-basic-transparent-600"]} />}
            >RESET</Button>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView >
    </TouchableWithoutFeedback>
  )
}

export default Reset


const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4EFED',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  header: {
    height: 40
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: height < 678 ? 25 : 50,
  },
  bgImage: {
    width,
    height: (height / 5 * 3),
  },
  input: {
    marginBottom: 10
  },
  signUpButtonContent: {
    height: (height / 5 * 2) - 40 - StatusBar.currentHeight,
    paddingBottom: isIphoneWithNotch() ? 100 : 50,
    justifyContent: 'flex-end',
    backgroundColor: '#ffff',
    paddingHorizontal: 25
  },
  signInButtonContent: {
    alignItems: 'center',
    marginTop: 15
  },
  successMessageContainer: {
    paddingHorizontal: 25,
    marginTop: 25,
    alignItems: 'center'
  },
  signInBtn: {
    marginTop: 10,
    width: '100%'
  },
  errorText: {
    marginBottom: 10
  }
})

