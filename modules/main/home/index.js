import React from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { Text } from '@ui-kitten/components'
import { createStackNavigator } from '@react-navigation/stack';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import StraightNursing from './straightNursing'
import { MenuButton, BackButton } from '@components';
import Subject from '../subject';
import Question from '../question';
import Score from '../score';
import Upgrade from '../upgrade';
import Blank from '../../blank';

const Stack = createStackNavigator();

const Home = ({ navigation }) => {
    return (
        <>
            <Stack.Navigator initialRouteName="StraightNursing">
                <Stack.Screen
                    options={{
                        title: <Text category="s1">STRAIGHT A NURSING</Text>,
                        headerTitleAlign: 'center',
                        headerLeft: () => <MenuButton
                            navigation={navigation} />
                    }}
                    name="StraightNursing"
                    component={StraightNursing}
                />
                <Stack.Screen
                    options={{
                        title: <Text category="s1">NO</Text>,
                        headerTitleAlign: 'center',
                        headerLeft: () => <MenuButton
                            navigation={navigation} />
                    }}
                    name="Blank"
                    component={Blank}
                />
                <Stack.Screen
                    name="Subject"
                    options={{
                        headerTitleAlign: 'center',
                    }}
                    component={Subject}
                />
                <Stack.Screen
                    name="Question"
                    options={{
                        headerTitleAlign: 'center',
                    }}
                    component={Question}
                />
                <Stack.Screen
                    name="Score"
                    options={{
                        headerTitleAlign: 'center',
                    }}
                    component={Score}
                />
                <Stack.Screen
                    name="Upgrade"
                    options={{
                        headerTitleAlign: 'center',
                    }}
                    component={Upgrade}
                />
            </Stack.Navigator>
        </>
    )
}

export default Home

const styles = StyleSheet.create({
    iconBtn: {
        marginLeft: wp(1.33),
        padding: wp(2.66)
    }
})
