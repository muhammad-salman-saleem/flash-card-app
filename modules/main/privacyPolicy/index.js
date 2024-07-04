import React, { useEffect } from "react"
import {
  View,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator
} from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { MenuButton, Card, BackButton } from "@components"
import {
  Text,
  useStyleSheet,
  StyleService,
  useTheme
} from "@ui-kitten/components"
import { useDispatch, useSelector } from "react-redux"
import { getPrivacyPolicy } from "./store"

const Stack = createStackNavigator()

const PrivacyPolicyScreen = () => {
  const styles = useStyleSheet(themedStyles)
  const dispatch = useDispatch()
  const privacyPolicy = useSelector(state => state.privacyPolicy.privacyPolicy)
  const api = useSelector(state => state.privacyPolicy.api)
  const theme = useTheme()

  useEffect(() => {
    dispatch(getPrivacyPolicy())
  }, [])

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
          <Text category="h6">Privacy</Text>
          <Text category="p1" style={styles.text}>
            {privacyPolicy[0]?.body}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

const PrivacyPolicy = ({ navigation }) => (
  <Stack.Navigator initialRouteName="StraightNursing">
    <Stack.Screen
      options={{
        title: <Text category="s1">PRIVACY POLICY</Text>,
        headerTitleAlign: "center",
        headerLeft: () => <BackButton navigation={navigation} />
      }}
      name="Resources"
      component={PrivacyPolicyScreen}
    />
  </Stack.Navigator>
)

export default PrivacyPolicy

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
    textDecorationLine: "underline"
  },
  text: {
    marginTop: 20,
    fontWeight: "400"
  }
})
