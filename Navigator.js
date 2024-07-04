import React, { useEffect } from 'react';
import { StatusBar, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import SplashScreen from "react-native-splash-screen";
import { unwrapResult } from "@reduxjs/toolkit"

import Auth from '@modules/social-login';
import { getAuthUser } from '@modules/social-login/auth';
import Main from '@modules/main';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from './modules/httpClient';

const Stack = createStackNavigator();

const linking = {
    prefixes: ['flashcardmaureen://'],
    initialRouteName: 'PasswordResetScreen',
    config: {
        screens: {
            Auth: {
                screens: {
                    PasswordResetScreen: 'password/reset/:token/',
                    AuthScreen: 'authscreen',
                    SignInScreen: 'signinscreen',
                    SignUpScreen: 'signupscreen',
                    ForgotPasswordScreen: 'forgotpasswordscreen',
                },
            },
            Main: {
                path: 'main'
            }
        }
    }
};

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#F4EFED',
    },
};


const AppStackNavigator = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.login.user);


    useEffect(() => {
        (async () => {
            let token = await AsyncStorage.getItem("@token")
            console.log("Token: ", token)
            if (token) {
                setAuthToken(JSON.parse(token))

                dispatch(getAuthUser(JSON.parse(token)))
                    .then(unwrapResult)
                    .then(res => {
                        console.log("getAuthUser Response: ", res);
                        SplashScreen.hide();
                    })
                    .catch(err => {
                        SplashScreen.hide();
                    });

            } else {
                SplashScreen.hide();
            }
        })();
    }, []);


    return (
        <NavigationContainer
            linking={linking}
            fallback={<ActivityIndicator color="blue" size="large" />}
            theme={theme}>

            <StatusBar barStyle='dark-content' translucent />
            <Stack.Navigator
                headerMode="none">
                {
                    user ?
                        <Stack.Screen name="Main" component={Main.navigator} />
                        :
                        <Stack.Screen name="Auth" component={Auth.navigator} />
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppStackNavigator;
