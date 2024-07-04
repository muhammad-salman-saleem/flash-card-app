import React, { useEffect } from "react"
import {
  View,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator
} from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { BackButton, MenuButton, Card } from "@components"
import {
  Text,
  useStyleSheet,
  StyleService,
  useTheme
} from "@ui-kitten/components"
import { useDispatch, useSelector } from "react-redux"
import { getTermsAndConditions } from "./store"

const Stack = createStackNavigator()

export const TermsAndConditionScreen = ({ navigation, route }) => {
  const styles = useStyleSheet(themedStyles)
  const dispatch = useDispatch()
  const termsAndCondition = useSelector(
    state => state.termsAndCondition.termsAndCondition
  )
  const api = useSelector(state => state.termsAndCondition.api)
  const theme = useTheme()

  useEffect(() => {
    dispatch(getTermsAndConditions())
  }, [])

  useEffect(() => {
    console.log("From Screen: ", route.params)

    navigation.setOptions({
      title: <Text category="s1">TERMS AND CONDITIONS</Text>,
      headerTitleAlign: "center",
      headerLeft: () =>
        route?.params?.fromScreen === "payment" ? (
          <BackButton navigation={navigation} />
        ) : (
          <BackButton navigation={navigation} />
        )
    })
  }, [route.params])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {api.loading ? (
        <View style={styles.loaderContent}>
          <ActivityIndicator color={theme["color-primary-500"]} />
        </View>
      ) : (
        <View style={styles.container}>
          <Text category="h6">Terms of Service</Text>
          <Text category="p1" style={styles.text}>
            {termsAndCondition[0]?.body}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

const TermsAndCondition = ({ navigation }) => (
  <Stack.Navigator initialRouteName="TermsAndConditionScreen">
    <Stack.Screen
      options={{
        title: <Text category="s1">TERMS AND CONDITIONS</Text>,
        headerTitleAlign: "center",
        headerLeft: () => <BackButton navigation={navigation} />
      }}
      name="TermsAndConditionScreen"
      component={TermsAndConditionScreen}
    />
  </Stack.Navigator>
)

export default TermsAndCondition

const themedStyles = StyleService.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  cardContent: {
    padding: 16
  },
  link: {
    marginTop: 5,
    textDecorationLine: "underline"
  },
  text: {
    marginTop: 20,
    fontWeight: "400"
  }
})
