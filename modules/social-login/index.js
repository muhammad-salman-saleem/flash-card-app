import React from "react";
import { Platform } from "react-native";
import { HeaderBackButton, createStackNavigator } from "@react-navigation/stack";
import { slice } from "./auth";
import PasswordReset from "./screens/reset";
import AuthScreen from "./screens/auth";
import SignIn from "./screens/signin";
import SignUp from "./screens/signUp";
import ForgotPassword from "./screens/forgotPassword";
import { FAQScreen } from "../main/faq";



const Stack = createStackNavigator();

export const LoginSignup = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name === 'FAQScreen'
      })}>
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
      <Stack.Screen name="SignInScreen" component={SignIn} />
      <Stack.Screen name="SignUpScreen" component={SignUp} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPassword} />
      <Stack.Screen name="PasswordResetScreen" component={PasswordReset} />
    </Stack.Navigator>
  );
};

export default {
  title: "login",
  navigator: LoginSignup,
  slice: slice,
};
