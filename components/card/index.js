import React from 'react'
import { View } from 'react-native'
import { StyleService, useStyleSheet } from '@ui-kitten/components'

const Card = ({ width, height, children, style }) => {
    const styles = useStyleSheet(themedStyles);
    return (
        <View style={[styles.card, { width, height }, style]}>
            {children}
        </View>
    )
}

export default Card

const themedStyles = StyleService.create({
    card: {
        marginBottom: 20,
        backgroundColor: '#ffff',
        borderRadius: 15,
        shadowColor: "#334454",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 18,
    },
})
