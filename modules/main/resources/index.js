import React, { useEffect } from 'react'
import { View, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { MenuButton, Card } from '@components';
import { Text, useStyleSheet, StyleService, useTheme } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { getResources } from './store'

const Stack = createStackNavigator();

const ResourcesScreen = () => {
    const styles = useStyleSheet(themedStyles);
    const dispatch = useDispatch();
    const resources = useSelector(state => state.resource.resources)
    const api = useSelector(state => state.resource.api)
    const theme = useTheme()

    useEffect(() => {
        dispatch(getResources())
    }, [])

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {
                api.loading ?
                    <View style={styles.loaderContent}>
                        <ActivityIndicator
                            color={theme["color-primary-500"]}
                        />
                    </View> :

                    resources.map((resource, i) => (
                        <Card key={i}>
                            <View style={styles.cardContent}>
                                <Text category="h6" style={{ marginBottom: 10 }}>{resource.title}</Text>
                                <Text>{resource.body}</Text>
                                <Pressable onPress={() => Linking.openURL(resource.source_link)}>
                                    <Text category="s1" status="success" style={styles.link}>Learn More</Text>
                                </Pressable>
                            </View>
                        </Card>
                    ))
            }


        </ScrollView>
    )
}

const Resources = ({ navigation }) => (
    <Stack.Navigator initialRouteName="StraightNursing">
        <Stack.Screen
            options={{
                title: <Text category="s1">RESOURCES</Text>,
                headerTitleAlign: 'center',
                headerLeft: () => <MenuButton
                    navigation={navigation} />
            }}
            name="Resources"
            component={ResourcesScreen}
        />
    </Stack.Navigator>
)

export default Resources

const themedStyles = StyleService.create({
    container: {
        paddingHorizontal: 18,
        paddingVertical: 20
    },
    cardContent: {
        padding: 16
    },
    link: {
        marginTop: 5,
        textDecorationLine: 'underline'
    }
})
