import React from 'react'
import { View, ImageBackground, Dimensions, Image, SafeAreaView } from 'react-native'
import { Text, useStyleSheet, Button, Input, StyleService, Divider } from '@ui-kitten/components';

const { width, height } = Dimensions.get('screen')

const AuthScreen = ({ navigation }) => {
    const styles = useStyleSheet(themedStyles);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}>
            <View style={styles.headerContent}>
                <Text category="h4" style={{ fontWeight: '300' }}>STRAIGHT</Text>
                <View style={styles.logoContent}>
                    <Image source={require("@assets/images/logo.png")} style={styles.logo} />
                </View>
                <Text category="h4" style={{ fontWeight: '300' }}>NURSING</Text>
            </View>
            <ImageBackground source={require("@assets/images/authBg.png")} resizeMode="stretch" style={styles.bgImage}>
                <View style={styles.buttonContent}>
                    <Button
                        status="primary"
                        style={{ marginBottom: 10 }}
                        onPress={() => navigation.navigate("SignInScreen")}
                    >SIGN IN</Button>
                    <Button
                        status="basic"
                        onPress={() => navigation.navigate("SignUpScreen")}
                    >SIGN UP</Button>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default AuthScreen

const themedStyles = StyleService.create({
    headerContent: {
        paddingTop: 15,
        height: height / 5 * 1,
        backgroundColor: '#ffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        height: 65,
        width: 65,
    },
    logoContent: {
        paddingHorizontal: 10
    },
    bgImage: {
        width,
        height: height / 5 * 4,
        position: 'absolute',
        bottom: 0,
        justifyContent: "center"
    },
    buttonContent: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: 'flex-end',
        paddingBottom: 50
    }
})
