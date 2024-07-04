import React, { useState } from "react"
import {
    View,
    ImageBackground,
    Dimensions,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    StatusBar,
    Platform
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import { useSelector, useDispatch } from "react-redux"
import { validateEmail } from "./constants"
import { Text, useStyleSheet, Button, Input, StyleService, useTheme } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { BackButton } from '@components'

import { resetPassword, resetMessages } from "../auth"
import { SafeAreaView } from "react-native";
import { isIphoneWithNotch } from "../../utils";

const { width, height } = Dimensions.get('screen')

const ForgotPassword = ({ navigation }) => {
    const styles = useStyleSheet(themedStyles);
    const [email, setEmail] = useState("")
    const theme = useTheme()

    const [validationError, setValidationError] = useState({
        email: "",
    })


    useFocusEffect(
        React.useCallback(() => {
            dispatch(resetMessages())
        }, [])
    );


    const { api } = useSelector(state => state.login)
    const { resetPasswordMessage } = useSelector(state => state.login)

    const dispatch = useDispatch()

    const onSubmitPress = async () => {
        if (!validateEmail.test(email))
            return setValidationError({
                email: "Please enter a valid email address.",
            })

        dispatch(resetPassword({ email }))
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <BackButton navigation={navigation} />
                <ImageBackground source={require("@assets/images/signInBg.png")} resizeMode="stretch" style={styles.bgImage}>
                    <View style={styles.headerContent}>
                        <Text category="h2">Forgot Password</Text>
                    </View>
                    <View style={{ paddingHorizontal: 25 }}>
                        <Input
                            keyboardType="email-address"
                            label=""
                            placeholder="Enter Email Address"
                            onChangeText={value => setEmail(value.trim())}
                            value={email}
                            error={validationError.email}
                            status={validationError.email ? "danger" : ""}
                            caption={validationError.email}
                            accessoryLeft={() => <Ionicons name="mail" size={24} color="#656E78" />}
                            style={styles.input}
                        />
                        <View style={styles.hint}>
                            <Text appearance="hint">We will send a reset code to your email.</Text>
                            {!!api.error && (
                                <Text status="danger" style={styles.msg}>{api.error.message}</Text>
                            )}

                            {resetPasswordMessage && <Text status="success" style={styles.msg}>{resetPasswordMessage}</Text>}
                            {api.error && <Text status="danger" style={styles.msg}>{api.error?.message ? api.error?.message : api.error}</Text>}

                        </View>
                    </View>
                </ImageBackground>
                <SafeAreaView style={{ flex: 1 }} />
                <View style={styles.signUpButtonContent}>
                    <Button
                        disabled={api.loading}
                        onPress={onSubmitPress}
                        style={styles.btn}
                        accessoryLeft={() => api.loading && <ActivityIndicator size="small" color={theme["color-basic-transparent-600"]} />}
                    >SEND RESET LINK</Button>
                </View>
            </SafeAreaView >
        </TouchableWithoutFeedback>
    )
}

export default ForgotPassword


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
    hint: {
        alignItems: 'center',
        marginTop: 30
    },
    msg: {
        marginTop: 15,
        paddingHorizontal: 20,
        textAlign: 'center'
    }
})

