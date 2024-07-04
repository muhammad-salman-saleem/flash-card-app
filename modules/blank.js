import React, { useState } from 'react'
import { View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { MenuButton, Card } from '@components';
import { Text, } from '@ui-kitten/components';

const Stack = createStackNavigator();

const Blank = ({ navigation }) => {
    return (
        <Stack.Navigator initialRouteName="StraightNursing">
            <Stack.Screen
                options={{
                    title: <Text category="s1"></Text>,
                    headerLeft: () => <MenuButton
                        navigation={navigation} />
                }}
                name="Resources"
                component={() => <View />}
            />
        </Stack.Navigator>
    )
}

export default Blank
