/* eslint-disable no-shadow */
import React, { useEffect, useState, createRef, useRef } from "react"
import {
  View,
  Dimensions,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator
} from "react-native"
import {
  Text,
  StyleService,
  useStyleSheet,
  useTheme,
  Button
} from "@ui-kitten/components"
import Carousel from "react-native-snap-carousel-v4" //todo
import GestureFlipView from "react-native-gesture-flip-card"
import { unwrapResult } from "@reduxjs/toolkit"

import { Card, BackButton } from "@components"
import { useSelector, useDispatch } from "react-redux"
import {
  getQuestions,
  attemptQuestion,
  resetScore,
  resetMissedAnswers,
  updateQuestion
} from "./store"
import { updateDeck } from "../subject/store"

const { width } = Dimensions.get("screen")

const Question = ({ navigation, route }) => {
  const styles = useStyleSheet(themedStyles)
  const theme = useTheme()
  const [elRefs, setElRefs] = useState([])
  const [lastAction, setLastAction] = useState()

  const [currentIndex, setCurrentIndex] = useState(1)
  const [showContinueBtn, setShowContinueBtn] = useState(false)
  const [questionsList, setQuestionsList] = useState([])
  const [selectedDeck, setSelectedDeck] = useState(null)

  const api = useSelector(state => state.question.api)
  const user = useSelector(state => state.login.user)
  const questions = useSelector(state => state.question.questions)
  const answers = useSelector(state => state.question.answers)
  const score = useSelector(state => state.question.score)
  const decks = useSelector(state => state.deck.decks)
  const dispatch = useDispatch()
  const carouselRef = createRef()

  useEffect(() => {
    const { question_id } = route.params
    const deck = decks?.find(item => item.id === question_id)
    setSelectedDeck(deck)
  }, [route.params, decks])

  useEffect(() => {
    const { question_id, question_name } = route.params
    navigation.setOptions({
      title: (
        <Text category="s1">{question_name?.slice(0, 25).toUpperCase()}</Text>
      ),
      headerLeft: () => <BackButton navigation={navigation} />
    })
    setCurrentIndex(1)
    setShowContinueBtn(false)
    dispatch(getQuestions(question_id))
    if (!route.params.repeat) {
      dispatch(resetScore())
    }
  }, [route.params])

  useEffect(() => {
    let shuffledQuestions = questions
      .map(value => ({ ...value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(value => value)
    if (route.params.repeat) {
      const questionList = shuffledQuestions.filter(filterQuestions)
      setQuestionsList(questionList)

      dispatch(resetMissedAnswers())
    } else {
      if (questions.length > 0) {
        setQuestionsList(shuffledQuestions)
      }
    }
  }, [route.params, questions])

  useEffect(() => {
    // add or remove refs
    if (questions.length > 0) {
      setElRefs(elRefs =>
        Array(questions.length)
          .fill()
          .map((_, i) => elRefs[i] || createRef())
      )
    }
  }, [questions])

  const answer = (question, answer, action) => {
    setLastAction(action)
    dispatch(
      attemptQuestion({
        user_answer_correct: answer,
        deck: question.deck,
        user: user.id,
        question: question.id
      })
    )
      .then(unwrapResult)
      .then(res => {
        console.log("Annswer: ", res)
        // update deck
        dispatch(
          updateDeck({
            deck: res.deck,
            answered_correct: res.answered_correct,
            answered_percentage: res.answered_percentage
          })
        )

        // dispatch(updateQuestion({
        //     questionAttempted: res
        // }))
      })
      .catch(err => {
        console.log(err.message)
      })

    let ref = carouselRef.current
    if (currentIndex === questionsList.length) {
      setShowContinueBtn(true)
    } else {
      setTimeout(() => {
        ref.snapToNext()
      }, 1000)
    }
  }

  const _renderItem = ({ item, index }) => {
    let cardRef = elRefs[index]
    return (
      <GestureFlipView
        width={width - 36}
        height={width - 36}
        ref={cardRef}
        gestureEnabled={false}
      >
        <View>
          <Card height={width - 36} width={width - 40}>
            <Pressable onPress={() => cardRef.current.flipLeft()}>
              <View style={styles.questionContent}>
                <View
                  style={[
                    styles.topLabelContent,
                    { backgroundColor: theme["color-basic-500"] }
                  ]}
                >
                  <Text category="s1" style={{ color: "#ffff" }}>
                    Question
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ marginBottom: 25 }}
                >
                  <Text category="h5" style={styles.question}>
                    {item.title}
                  </Text>
                </ScrollView>
                <View style={styles.flipBtn}>
                  <Text>Tap to flip</Text>
                </View>
              </View>
            </Pressable>
          </Card>
        </View>
        {/* Back Side */}
        <View>
          <Card height={width - 36} width={width - 40}>
            <View style={[styles.questionContent, { padding: 0 }]}>
              <Pressable
                height={width - 110}
                style={styles.pressableContainer}
                onPress={() => cardRef.current.flipLeft()}
              >
                <View
                  style={[
                    styles.topLabelContent,
                    { backgroundColor: theme["color-success-500"] }
                  ]}
                >
                  <Text category="s1" style={{ color: "#ffff" }}>
                    Answer
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ marginBottom: 25 }}
                >
                  <Text
                    category="h5"
                    style={[
                      styles.question,
                      { padding: 20, paddingHorizontal: 40 }
                    ]}
                  >
                    {item.right_answer}
                  </Text>
                </ScrollView>

                <View style={styles.flipBtn}>
                  <Text>Tap to flip</Text>
                </View>
              </Pressable>
              <View style={styles.actionContent}>
                <Pressable
                  disabled={api?.attemptQuestionLoading}
                  onPress={() => answer(item, false, "missed")}
                  style={[
                    styles.actionBtn,
                    answers[item.id] === false && {
                      borderColor: theme["color-success-500"]
                    }
                  ]}
                >
                  {lastAction === "missed" && api?.attemptQuestionLoading ? (
                    <ActivityIndicator color={"#000000"} size={"small"} />
                  ) : answers[item.id] === false ? (
                    <Image
                      source={require("@assets/images/check-completed.png")}
                    />
                  ) : (
                    <Image source={require("@assets/images/uncheck.png")} />
                  )}
                  <Text category="s1">Missed it</Text>
                </Pressable>
                <Pressable
                  disabled={api?.attemptQuestionLoading}
                  onPress={() => answer(item, true, "got")}
                  style={[
                    styles.actionBtn,
                    answers[item.id] === true && {
                      borderColor: theme["color-success-500"]
                    }
                  ]}
                >
                  {lastAction === "got" && api?.attemptQuestionLoading ? (
                    <ActivityIndicator color={"#000000"} size={"small"} />
                  ) : answers[item.id] === true ? (
                    <Image
                      source={require("@assets/images/check-completed.png")}
                    />
                  ) : (
                    <Image source={require("@assets/images/uncheck.png")} />
                  )}
                  <Text category="s1">Got it</Text>
                </Pressable>
              </View>
            </View>
          </Card>
        </View>
      </GestureFlipView>
    )
  }

  function filterQuestions(question) {
    if (answers[question.id]) return false
    return true
  }

  return (
    <View style={styles.container}>
      {api.loading ? (
        <View style={styles.loaderContent}>
          <ActivityIndicator color={theme["color-primary-500"]} />
        </View>
      ) : (
        <>
          <View style={styles.scoreContent}>
            <Text style={{ color: "#000000" }} category="s1">
              {questionsList.length > 0 ? currentIndex : 0} of{" "}
              {questionsList.length}
            </Text>
            <Text style={{ color: "#000000" }} category="s1" status="success">
              Score:{" "}
              {selectedDeck?.total_questions > 0
                ? Math.round(
                    (selectedDeck?.answered_correct /
                      selectedDeck?.total_questions) *
                      100
                  )
                : 0}
              %
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Carousel
              ref={carouselRef}
              onSnapToItem={index => setCurrentIndex(index + 1)}
              data={questionsList}
              renderItem={_renderItem}
              sliderWidth={width}
              itemWidth={width}
              slideStyle={styles.slideStyle}
            />
          </View>
          <View style={styles.btnContainer}>
            {showContinueBtn && (
              <Button
                onPress={() =>
                  navigation.navigate("Score", {
                    question_id: route.params.question_id,
                    question_name: route.params.question_name
                  })
                }
                style={styles.btn}
              >
                SEE SCORE
              </Button>
            )}
          </View>
        </>
      )}
    </View>
  )
}

export default Question

const themedStyles = StyleService.create({
  container: {
    flex: 1
  },
  loaderContent: {
    flex: 1,
    paddingVertical: 18,
    alignItems: "center"
  },
  scoreContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 18
  },
  questionContent: {
    padding: 20,
    alignItems: "center",
    height: width - 36
  },
  question: {
    marginTop: 30,
    paddingHorizontal: 20,
    textAlign: "center",
    color: "black"
  },
  topLabelContent: {
    backgroundColor: "color-success-500",
    position: "absolute",
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#ffff",
    top: -15,
    zIndex: 100,
    elevation: 1
  },
  flipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  actionContent: {
    backgroundColor: "background-basic-color-2",
    paddingVertical: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  pressableContainer: {
    width: "100%",
    alignItems: "center"
  },
  actionBtn: {
    backgroundColor: "#ffff",
    paddingHorizontal: 20,
    borderRadius: 6,
    width: "45%",
    paddingVertical: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ffff"
  },
  btn: {
    marginBottom: 50
  },
  btnContainer: {
    //paddingVertical: 20,
    paddingHorizontal: 18
  },
  slideStyle: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 18
  }
})
