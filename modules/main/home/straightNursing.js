import React, { useEffect } from 'react'
import { View, Dimensions, Image, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Text, useTheme } from '@ui-kitten/components'
import { Card } from '@components'
import { useSelector, useDispatch } from "react-redux"
import { getCategories } from "./store"

const { width } = Dimensions.get('window')
const cardWidth = (width - 60) / 2

const StraightNursing = ({ navigation }) => {
    const api = useSelector(state => state.category.api)

    const category = useSelector(state => state.category)
    const dispatch = useDispatch()
    const theme = useTheme()


    useEffect(() => {
        dispatch(getCategories())
    }, [])


    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {
                api.loading ?
                    <View style={styles.loaderContent}>
                        <ActivityIndicator
                            color={theme["color-primary-500"]}
                        />
                    </View> :
                    category.categories?.map((card, key) =>
                        <Pressable
                            key={key}
                            onPress={() => navigation.navigate("Subject", {
                                category_id: card.id,
                                category_name: card.name
                            })}
                        >
                            {
                                ({ pressed }) => <Card width={cardWidth} height={cardWidth}>
                                    <View style={[styles.content, pressed && styles.focus]}>
                                        <Image
                                            source={{ uri: card.image }} style={styles.image} />
                                        <Text category="s1" style={styles.text}>{card.name}</Text>
                                    </View>
                                </Card>
                            }
                        </Pressable>
                    )
            }
        </ScrollView>
    )
}

export default StraightNursing

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingHorizontal: 18,
        paddingVertical: 20
    },
    text: {
        fontSize: 16,
        marginTop: 5
    },
    content: {
        padding: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    image: {
        height: 80,
        width: 80
    }
})
