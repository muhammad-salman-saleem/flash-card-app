import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Animated from 'react-native-reanimated';

const Stack = createStackNavigator();

const MainComponent = ({ children }) => {
    return (
        <View style={[styles.container]}>
            {children}
        </View>
    );
};

export default ({ name, style, component }) => {
    return (
        <Animated.View style={[styles.animatedView, style]}>
            <Stack.Navigator>
                <Stack.Screen
                    name={name}
                    options={{
                        headerShown: false,
                    }}
                >
                    {props => <MainComponent {...props} >{component(props)}</MainComponent>}
                </Stack.Screen>
            </Stack.Navigator>
        </Animated.View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    animatedView: {
        flex: 1,
        overflow: 'hidden'
    },
});