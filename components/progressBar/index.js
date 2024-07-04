import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '@ui-kitten/components'

const ProgressBar = ({ color, percentage, containerStyle }) => {

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.content}>
                <View style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5
                }} />
                <View style={{
                    width: `${100 - percentage}%`,
                    backgroundColor: color,
                    opacity: 0.3,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5
                }} />
            </View>
            <Text category="s1" style={{ color, fontFamily: 'Gilroy-Bold' }}>{percentage}%</Text>
        </View>

    )
}

export default ProgressBar

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    content: {
        flex: 0.98,
        height: 5,
        flexDirection: 'row'
    }
})
