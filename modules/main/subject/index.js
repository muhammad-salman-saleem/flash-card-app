import React, { useEffect } from 'react'
import { View, Dimensions, Image, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { Text, useTheme } from '@ui-kitten/components'
import { Card, ProgressBar } from '@components'
import { useSelector, useDispatch } from "react-redux"
import { getDecks } from './store'
import { BackButton } from '@components'
import { useFocusEffect } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAuthUser } from '@modules/social-login/auth'


const { width } = Dimensions.get('window')
const cardWidth = (width - 30)

const Subject = ({ navigation, route }) => {

    const api = useSelector(state => state.deck.api)
    const decks = useSelector(state => state.deck.decks)
    const user = useSelector(state => state.login.user)
    const userApi = useSelector(state => state.login?.api)
    const dispatch = useDispatch()
    const theme = useTheme()

    useFocusEffect(
        React.useCallback(() => {
            const { category_id, category_name } = route.params
            navigation.setOptions({
                title: <Text category="s1">{category_name?.slice(0, 25).toUpperCase()}</Text>,
                headerLeft: () => <BackButton navigation={navigation} />
            });
            dispatch(getDecks(category_id))
        }, [dispatch, route.params.category_id])
    )

    useFocusEffect(React.useCallback(() => {
        async function fetchData() {
            let token = await AsyncStorage.getItem("@token")
            dispatch(getAuthUser(JSON.parse(token)))
        }
        fetchData();
    }, []));

    const onSubjectSelect = (card) => {
        // if (!user.payment_done && card.answered_correct > 0) {
        //     navigation.navigate("Score", {
        //         question_id: card.id,
        //         question_name: card.name
        //     })
        // } else {
        //     navigation.navigate("Question", {
        //         question_id: card.id,
        //         question_name: card.name
        //     })
        // }

        if (!(card.is_free || user?.payment_done)) {
            navigation.navigate('Main', { screen: 'Upgrade' })
            return;
        }

        navigation.navigate("Question", {
            question_id: card.id,
            question_name: card.name
        })
    }


    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {
                (api.loading || userApi.loading) ?
                    <View style={styles.loaderContent}>
                        <ActivityIndicator
                            color={theme["color-primary-500"]}
                        />
                    </View> :
                    decks.map((card, key) => {
                        let color = "#FFC61C"
                        if (card.completion === 100) {
                            color = "#3FBDA6"
                        }
                        if (card.completion === 0) {
                            color = "#656E78"
                        }
                        return (
                            <Pressable
                                key={key}
                                onPress={() => onSubjectSelect(card)}>
                                {
                                    ({ pressed }) =>
                                        <Card width={cardWidth}>
                                            <View style={[styles.content, pressed && styles.focus]}>
                                                <View style={styles.textContent}>
                                                    <View style={{ flex: 1 }}>
                                                        <View style={styles.lockContent}>
                                                            <Text category="h6">{card.name}</Text>
                                                            {
                                                                !(card.is_free || user?.payment_done) &&
                                                                <Ionicons
                                                                    name="lock-closed-outline"
                                                                    size={24}
                                                                    color="#656E78"
                                                                />
                                                            }
                                                        </View>
                                                        <Text category="s1">{card.total_questions} Questions</Text>
                                                    </View>
                                                    <View style={styles.statusIconWrapper}>
                                                        {
                                                            card.status === 1 &&
                                                            <Image source={require("@assets/images/check-completed.png")} />
                                                        }
                                                        {
                                                            card.status === 2 &&
                                                            <Image source={require("@assets/images/lock.png")} />
                                                        }
                                                    </View>
                                                </View>
                                                <ProgressBar
                                                    percentage={card.total_questions > 0 ? Math.round((card.answered_correct / card.total_questions) * 100) : 0}
                                                    color={color}
                                                    containerStyle={styles.progress}
                                                />
                                            </View>
                                        </Card>
                                }
                            </Pressable>
                        )
                    }
                    )
            }
        </ScrollView>
    )
}

export default Subject

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingVertical: 20
    },
    text: {
        fontSize: 16,
        marginTop: 5
    },
    content: {
        padding: 15,
    },
    progress: {
        marginTop: 2
    },
    textContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusIconWrapper: {
        alignItems: 'flex-end'
    },
    focus: {
        borderWidth: 1,
        borderColor: '#d4d4d4',
        borderRadius: 15,
    },
    loaderContent: {
        flex: 1,
        alignItems: 'center'
    },
    lockContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})
