import React from 'react'
import { StyleSheet } from 'react-native'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const BackButton = ({ navigation }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
        >
            <Image source={require("@assets/images/chevron-left.png")} />
        </TouchableOpacity>
    )
}

export default BackButton

const styles = StyleSheet.create({
    iconBtn: {
        marginLeft: wp(1.33),
        padding: wp(2.66)
    }
})
