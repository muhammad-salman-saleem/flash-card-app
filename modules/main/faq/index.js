import React, { useState, useEffect } from "react"
import { View, ScrollView, Pressable, Linking } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { MenuButton, BackButton } from "@components"
import {
  Text,
  useStyleSheet,
  StyleService,
  useTheme
} from "@ui-kitten/components"
import Accordion from "react-native-collapsible/Accordion"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useDispatch, useSelector } from "react-redux"
import { ActivityIndicator } from "react-native"
import { getFaqs } from "./store"

const Stack = createStackNavigator()

export const FAQScreen = ({ navigation }) => {
  const styles = useStyleSheet(themedStyles)
  const [activeSections, setActiveSections] = useState([])
  const api = useSelector(state => state.faq.api)
  const faqs = useSelector(state => state.faq.faqs)
  const dispatch = useDispatch()
  const theme = useTheme()
  const SUPPORT_EMAIL = "support@straightanursingstudent.com"

  useEffect(() => {
    dispatch(getFaqs())
  }, [])

  useEffect(() => {
    navigation.setOptions({
      title: <Text category="s1">FAQs</Text>,
      headerTitleAlign: "center",
      headerLeft: () => <BackButton navigation={navigation} />
    })
  }, [])

  const setSections = sections => {
    setActiveSections(sections.includes(undefined) ? [] : sections)
  }

  const openEmailClient = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`)
  }

  const renderHeader = (section, _, isActive) => {
    return (
      <View
        style={[
          styles.header,
          {
            backgroundColor: isActive ? "rgba(63, 189, 166, 0.05)" : "#ffff",
            paddingBottom: isActive ? 0 : 15,
            borderBottomLeftRadius: !isActive ? 15 : 0,
            borderBottomRightRadius: !isActive ? 15 : 0
          }
        ]}
      >
        <Text
          style={styles.headerText}
          category={isActive && "s1"}
          status={isActive && "success"}
        >
          {section.title}
        </Text>
        <Ionicons
          name={isActive ? "chevron-up" : "chevron-down"}
          size={24}
          color={isActive ? "#3FBDA6" : "#1D2B48"}
        />
      </View>
    )
  }

  const renderContent = (section, _, isActive) => {
    return (
      <View
        style={{
          backgroundColor: isActive ? "rgba(63, 189, 166, 0.05)" : "#ffff",
          paddingHorizontal: 18,
          paddingVertical: 15,
          borderBottomLeftRadius: isActive ? 15 : 0,
          borderBottomRightRadius: isActive ? 15 : 0
        }}
      >
        <Text>{section.description}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {api.loading ? (
        <View style={styles.loaderContent}>
          <ActivityIndicator color={theme["color-primary-500"]} />
        </View>
      ) : (
        <View style={{ flex: 0.9 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Accordion
              activeSections={activeSections}
              sections={faqs}
              touchableComponent={Pressable}
              expandMultiple={false}
              renderHeader={renderHeader}
              renderContent={renderContent}
              duration={200}
              onChange={setSections}
              renderAsFlatList={false}
              sectionContainerStyle={styles.card}
            />
          </ScrollView>
        </View>
      )}
      <View style={styles.contactContainer}>
        <Text category="s1">Contact:</Text>
        <Text category="s2" onPress={openEmailClient} style={styles.email}>
          {SUPPORT_EMAIL}
        </Text>
      </View>
    </View>
  )
}

const FAQ = ({ navigation }) => (
  <Stack.Navigator initialRouteName="StraightNursing">
    <Stack.Screen
      options={{
        title: <Text category="s1">FAQ</Text>,
        headerTitleAlign: "center",
        headerLeft: () => <MenuButton navigation={navigation} />
      }}
      name="FAQ"
      component={FAQScreen}
    />
  </Stack.Navigator>
)

export default FAQ

const themedStyles = StyleService.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 20,
    flex: 1
  },
  card: {
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: "#334454",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 0
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  contactContainer: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    // paddingVertical: 20,
    paddingBottom: 20
  },
  email: {
    color: "header-background-color"
  },
  loaderContent: {
    flex: 1,
    alignItems: "center"
  }
})
