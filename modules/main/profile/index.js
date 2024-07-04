import React, { useEffect, useLayoutEffect, useState } from "react"
import {
  View,
  Image,
  Pressable,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  ScrollView
} from "react-native"
import { format, fromUnixTime } from "date-fns"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { createStackNavigator } from "@react-navigation/stack"
import { MenuButton } from "@components"
import {
  Text,
  useStyleSheet,
  Button,
  Input,
  StyleService
} from "@ui-kitten/components"
import Ionicons from "react-native-vector-icons/Ionicons"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { launchImageLibrary } from "react-native-image-picker"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  logoutRequest,
  patchUserById,
  postDeactivateUser,
  updateUserImage
} from "@modules/social-login/auth"
import { useDispatch, useSelector } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { setAuthToken } from "../../httpClient"
import MyButton from "../../../components/myButton"
import PasswordResetModal from "./PasswordResetModal"
import { getSubscription } from "../upgrade/store"
import { validateEmail } from "../../social-login/screens/constants"

const Stack = createStackNavigator()

const UserProfile = ({ navigation }) => {
  const styles = useStyleSheet(themedStyles)
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(true)
  const user = useSelector(state => state.login?.user)
  const subscriptionObject = useSelector(
    state => state.payments.subscriptionObject
  )
  const api = useSelector(state => state.login?.api)
  const payment_api = useSelector(state => state.payments.api)
  const [values, setValues] = useState({
    name: "",
    email: ""
  })

  const [passwordResetModalVisibility, setPasswordResetModalVisibility] =
    useState(false)

  const [validationError, setValidationError] = useState({
    name: "",
    email: ""
  })
  const [imageLoaded, setImageLoaded] = useState(true)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        disabled ? (
          <Pressable
            style={styles.rightHeaderBtn}
            onPress={() => setDisabled(false)}
          >
            <Text>Edit</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.rightHeaderBtn} onPress={saveProfile}>
            <Text>Save</Text>
          </Pressable>
        )
    })
  }, [disabled, values])

  useEffect(() => {
    dispatch(getSubscription())
  }, [])

  useEffect(() => {
    console.log(subscriptionObject?.current_period_end)
  }, [subscriptionObject])
  useEffect(() => {
    if (user) {
      setValues({
        name: user.name,
        email: user.email
      })
    }
  }, [user])

  const onChangeText = (label, text) => {
    let errors = {
      [label]: ""
    }
    if (label === "email" && !validateEmail.test(text))
      errors.email = "Please enter a valid email address."

    if (label === "name" && !text) errors.name = "Please enter a valid name"

    setValidationError({
      ...validationError,
      ...errors
    })
    setValues({
      ...values,
      [label]: text
    })
  }

  const saveProfile = () => {
    setDisabled(true)

    dispatch(
      patchUserById({
        id: user.id,
        ...values
      })
    ).catch(err => {
      console.log(err)
    })
  }

  const logOut = () => {
    dispatch(logoutRequest())
      .then(unwrapResult)
      .then(res => {
        setAuthToken("")
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  const uploadImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.5,
        maxWidth: 480,
        maxHeight: 480,
        includeBase64: false,
        selectionLimit: 1
      },
      ({ assets }) => {
        if (assets) {
          dispatch(
            updateUserImage({
              id: user.id,
              image: assets[0]
            })
          )
        }
      }
    )
  }

  const cancelAccount = () => {
    dispatch(postDeactivateUser())
      .then(unwrapResult)
      .then(res => {
        Alert.alert(
          "",
          "If you are a paid subscriber, your account will downgrade to the free version at the end of your billing period. You will not be charged again. If you are a free user, your profile has been removed. Thank you for trying the app!"
        )
        setAuthToken("")
      })
      .catch(err => {
        Alert.alert(
          "Unable to cancel account",
          err.message ??
            "There was some error deleting account, please try again."
        )
      })
  }

  const onCancelAccount = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to deactivate your account?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => cancelAccount() }
      ]
    )
  }

  const onPasswordResetTap = () => {
    console.log("Pressed")
    setPasswordResetModalVisibility(true)
  }

  const resetAccessory = () => {
    return (
      <TouchableWithoutFeedback onPress={onPasswordResetTap}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableWithoutFeedback>
    )
  }

  const onUpgradePress = () => {
    navigation.navigate("Upgrade")
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {payment_api.loading.getSubscription ? (
        <ActivityIndicator style={{ marginTop: 10 }} />
      ) : (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContent}
            enableOnAndroid={true}
            extraHeight={80}
            behavior={Platform.OS === "ios" ? "position" : null}
            enableAutomaticScroll={Platform.OS === "ios"}
          >
            <ScrollView style={styles.scrollView}>
              <View style={styles.profileImageContent}>
                <View>
                  <Image
                    source={
                      user?.profile_image
                        ? { uri: user?.profile_image }
                        : require("@assets/images/avatar.jpeg")
                    }
                    style={styles.profileImage}
                    onLoad={() => setImageLoaded(false)}
                  />
                  <View style={styles.editBtnContent}>
                    <Pressable style={styles.editBtn} onPress={uploadImage}>
                      {api.loading || imageLoaded ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        <Ionicons name="create-sharp" size={24} color="#000" />
                      )}
                    </Pressable>
                  </View>
                </View>
                {user?.payment_done ? (
                  <View style={styles.statusContent}>
                    <Text category="s1" status="success">
                      Premium Member
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    style={styles.statusContent}
                    onPress={onUpgradePress}
                  >
                    <Text category="s1" status="warning">
                      Upgrade Membership
                    </Text>
                  </Pressable>
                )}
              </View>

              <Input
                placeholder="Enter name"
                onChangeText={value => onChangeText("name", value)}
                value={values.name}
                error={validationError.name}
                status={validationError.name ? "danger" : ""}
                caption={validationError.name}
                accessoryLeft={() => (
                  <Ionicons name="person" size={24} color="#656E78" />
                )}
                style={styles.input}
                disabled={disabled}
              />
              <Input
                keyboardType="email-address"
                label=""
                placeholder="Enter Email Address"
                onChangeText={value => onChangeText("email", value)}
                value={values.email}
                error={validationError.email}
                accessoryLeft={() => (
                  <Ionicons name="mail" size={24} color="#656E78" />
                )}
                style={styles.input}
                disabled={disabled}
              />

              <Input
                keyboardType="default"
                label=""
                placeholder="Password"
                defaultValue="********"
                accessoryLeft={() => (
                  <Ionicons name="md-lock-closed" size={24} color="#656E78" />
                )}
                accessoryRight={resetAccessory}
                style={styles.input}
                textStyle={{ marginTop: -6, fontSize: 20 }}
                disabled={true}
                secureTextEntry={true}
              />

              {subscriptionObject?.status === "active" &&
              subscriptionObject?.current_period_end ? (
                <Input
                  keyboardType="default"
                  label=""
                  defaultValue={`Next billing date is ${format(
                    fromUnixTime(subscriptionObject?.current_period_end),
                    "PP"
                  )}`}
                  accessoryLeft={() => (
                    <Ionicons name="calendar" size={24} color="#656E78" />
                  )}
                  style={styles.input}
                  disabled={true}
                />
              ) : null}

              <View style={styles.signUpButtonContent}>
                <MyButton style={styles.btn} onPress={logOut}>
                  SIGN OUT
                </MyButton>

                <MyButton
                  loading={api.loading}
                  status="basic"
                  style={styles.btn}
                  onPress={onCancelAccount}
                >
                  CANCEL ACCOUNT
                </MyButton>
              </View>

              <PasswordResetModal
                modalVisible={passwordResetModalVisibility}
                setModalVisible={setPasswordResetModalVisibility}
              />
            </ScrollView>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      )}
    </TouchableWithoutFeedback>
  )
}

const Profile = ({ navigation }) => (
  <Stack.Navigator initialRouteName="StraightNursing">
    <Stack.Screen
      options={{
        headerTitleAlign: "center",
        title: <Text category="s1">ACCOUNT SUMMARY</Text>,
        headerLeft: () => <MenuButton navigation={navigation} />
      }}
      name="StraightNursing"
      component={UserProfile}
    />
  </Stack.Navigator>
)

export default Profile

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    paddingBottom: 20
  },
  resetText: {
    fontWeight: "800",
    fontSize: 14
  },
  scrollContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  scrollView: {
    paddingHorizontal: 18,
    paddingTop: 20
  },
  profileImageContent: {
    alignItems: "center",
    marginBottom: 20
  },

  profileImage: {
    height: wp(45),
    width: wp(45),
    borderRadius: wp(45) / 2,
    position: "relative"
  },

  statusContent: {
    backgroundColor: "background-basic-color-1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 6
  },

  input: {
    marginBottom: 15
  },
  signUpButtonContent: {
    marginTop: 30,
    marginBottom: 20
  },
  btn: {
    marginTop: 10
  },
  rightHeaderBtn: {
    marginLeft: wp(1.33),
    padding: wp(2.66)
  },
  editBtn: {
    backgroundColor: "#e2e2e2",
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: "#5c5c5c"
  },
  editBtnContent: {
    position: "absolute",
    right: 10,
    bottom: 10
  }
})
