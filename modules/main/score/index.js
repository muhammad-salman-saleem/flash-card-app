import React, { useEffect, useState } from 'react'
import { View, Dimensions, Pressable, Image, TouchableOpacity } from 'react-native'
import { Text, StyleService, useStyleSheet, Button } from '@ui-kitten/components'
import { CircularProgress, Card } from '@components'
import { useSelector } from 'react-redux'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window')

const Score = ({ navigation, route }) => {
    const styles = useStyleSheet(themedStyles)
    const score = useSelector(state => state.question.score)
    const noOfCorrectAnswers = useSelector(state => state.question.noOfCorrectAnswers)
    const questions = useSelector(state => state.question.questions)
    const user = useSelector(state => state.login?.user)
    const decks = useSelector(state => state.deck.decks)

    const [selectedDeck, setSelectedDeck] = useState(null)

    useEffect(() => {

        const { question_id } = route.params
        const deck = decks?.find(item => item.id === question_id)
        setSelectedDeck(deck)

    }, [route.params, decks])


    useEffect(() => {
        navigation.setOptions({
            title: <Text category="s1">SCORE</Text>,
            headerLeft: () => <TouchableOpacity style={styles.leftBtn} onPress={() => navigation.navigate("Subject")}>
                <Image source={require("@assets/images/chevron-left.png")} />
            </TouchableOpacity>
        });
    }, [])

    const repeatQuestions = () => {
        if (user?.payment_done) {
            navigation.navigate("Question", {
                question_id: route.params.question_id,
                question_name: route.params.question_name,
                repeat: true
            })
        } else {
            navigation.navigate("Upgrade")
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.cardWrapper}>
                <Card height={width} style={{ minHeight: 405 }}>
                    <View style={styles.content}>
                        <CircularProgress
                            clockwise={false}
                            percent={selectedDeck?.total_questions > 0 ? Math.round((selectedDeck?.answered_correct / selectedDeck?.total_questions) * 100) : 0}
                        />

                        <View style={{ flex: 1 }}>
                            <View style={[styles.textContent, { marginTop: 20 }]}>
                                <Text category="h6" style={styles.text}>Total Questions</Text>
                                <Text category="h6" style={styles.text}>Correct Answers</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.textContent}>
                                <Text category="h3" style={styles.text}>{questions.length}</Text>
                                <Text category="h3" style={styles.text}>{selectedDeck?.answered_correct}</Text>
                            </View>
                        </View>
                        <View>
                            {
                                questions.length !== score &&
                                <Pressable style={styles.button} onPress={repeatQuestions}>
                                    <Image source={require("@assets/images/repeat.png")} style={{ marginRight: 10 }} />
                                    <Text category="s1" status="success">Repeat missed questions</Text>
                                </Pressable>
                            }
                        </View>
                    </View>
                </Card>
                {
                    !user?.payment_done &&
                    <>
                        <Text category="s1" style={styles.upgradeText}>
                            Upgrade to repeat missed questions and access thousands of flashcards.
                        </Text>
                        <Button onPress={() => navigation.navigate("Upgrade")}>
                            UPGRADE
                        </Button>
                    </>
                }
            </View>
        </View>
    )
}

export default Score

const themedStyles = StyleService.create({
    container: {
        flex: 1,
        paddingHorizontal: 18,
        paddingVertical: 20,
    },
    content: {
        padding: 20,
        paddingHorizontal: 30,
        flex: 1,
        alignItems: 'center'
    },
    textContent: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        textAlign: 'center',
        flex: 1
    },
    divider: {
        marginVertical: 10,
        width: '100%',
        borderTopWidth: 1,
        borderColor: "#F4EFED"
    },
    button: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 5,
        backgroundColor: 'background-basic-color-1',
        flexDirection: 'row'
    },
    cardWrapper: {
        flex: 1,
        backgroundColor: 'background-basic-color-3',
    },
    upgradeText: {
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    leftBtn: {
        marginLeft: wp(1.33),
        padding: wp(2.66)
    }
})
