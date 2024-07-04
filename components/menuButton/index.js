import React from 'react'
import { StyleSheet } from 'react-native'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const MenuButton = ({ navigation }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconBtn}
            onPress={() => navigation.toggleDrawer()}
        >
            <Image source={require("@assets/images/menu-alt-left.png")} />
        </TouchableOpacity>
    )
}

export default MenuButton

const styles = StyleSheet.create({
    iconBtn: {
        marginLeft: wp(1.33),
        padding: wp(2.66)
    }
})
