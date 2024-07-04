// import React, { useEffect, useState } from "react"
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Platform,
//   View,
//   Pressable,
//   Keyboard,
//   Appearance,
//   ScrollView,
//   TouchableWithoutFeedback
// } from "react-native"
// import {
//   Text,
//   StyleService,
//   useStyleSheet,
//   Button,
//   CheckBox
// } from "@ui-kitten/components"
// import { Card, BackButton } from "@components"
// import { SafeAreaView } from "react-native-safe-area-context"
// // import {
// //   StripeProvider,
// //   CardForm,
// //   useConfirmPayment,
// //   useApplePay,
// //   useGooglePay,
// //   StripeContainer
// // } from "@stripe/stripe-react-native"
// import { useDispatch, useSelector } from "react-redux"

// const PaymentMethod = ({ navigation, route }) => {
//   const styles = useStyleSheet(themedStyles)
//   const {
//     clientSecret,
//     subscriptionId,
//     subscription_amount,
//     subscription_type,
//     prices,
//     couponObject
//   } = route.params
//   const dispatch = useDispatch()
//   const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
//     useState(false)
//   const user = useSelector(state => state.login?.user)
//   const userApi = useSelector(state => state.login?.api)
// //   const { confirmPayment, loading } = useConfirmPayment()
// //   const { presentApplePay, confirmApplePayPayment, isApplePaySupported } =
// //     useApplePay()

// //   const { isGooglePaySupported, initGooglePay, presentGooglePay } =
// //     useGooglePay()

//   const [discountAmount, setDiscountAmount] = useState(0)
//   const [discountAmountStr, setDiscountAmountStr] = useState(null)
//   const [formComplete, setFormComplete] = useState(false)

//   useEffect(() => {
//     console.log("State: ", user)
//   }, [user])
//   useEffect(async () => {
//     navigation.setOptions({
//       title: <Text category="s1">Payment Methods</Text>,
//       headerLeft: () => <BackButton navigation={navigation} />
//     })

//     // if (!(await isGooglePaySupported({ testEnv: true }))) {
//     //   return
//     // }

//     // const { error } = await initGooglePay({
//     //   testEnv: true,
//     //   merchantName: "Flash Card",
//     //   countryCode: "US",
//     //   billingAddressConfig: {
//     //     format: "FULL",
//     //     isPhoneNumberRequired: true,
//     //     isRequired: false
//     //   },
//     //   existingPaymentMethodRequired: true,
//     //   isEmailRequired: false
//     // })

//     // if (error) {
//     //   Alert.alert(error.code, error.message)
//     //   return
//     // }
//   }, [])

//   useEffect(() => {
//     if (couponObject) {
//       const off = couponObject.percent_off
//         ? `${couponObject.percent_off}% off`
//         : `$${couponObject.amount_off} off`
//       setDiscountAmountStr(off)

//       const discount = couponObject.percent_off
//         ? (subscription_amount / 100) * couponObject.percent_off
//         : couponObject.amount_off
//       setDiscountAmount(discount.toFixed(2))
//     }
//   }, [subscription_amount, couponObject])

//   const onPaymentSuccess = () => {
//     Alert.alert(
//       "Payment Processed",
//       "Your payment has been processed successfully!",
//       [
//         {
//           text: "OK",
//           onPress: () =>
//             navigation.navigate("Upgrade", { screen: "Subscriptions" })
//         }
//       ]
//     )
//   }

// //   const onPayCreditCard = async () => {
// //     const billingDetails = {
// //       email: user.email
// //     }
// //     // Confirm the payment with the card details
// //     const { paymentIntent, error } = await confirmPayment(clientSecret, {
// //       paymentMethodType: "Card",
// //       billingDetails
// //     })

// //     if (error) {
// //       Alert.alert("Error", error.localizedMessage)
// //     } else if (paymentIntent) {
// //       onPaymentSuccess()
// //     }
// //   }

// //   const onApplePayPress = async () => {
// //     if (!isTermsAndConditionsChecked) {
// //       Alert.alert(
// //         "Error",
// //         "Please accept terms and conditions before proceeding."
// //       )
// //       return
// //     }

// //     if (!isApplePaySupported) {
// //       Alert.alert("Error", "Apple Pay is not supported")
// //       return
// //     }

// //     const { error } = await presentApplePay({
// //       cartItems: [
// //         {
// //           label: `Flash Card ${subscription_type} subscription`,
// //           amount: `${subscription_amount - discountAmount}`,
// //           paymentType: "Recurring",
// //           intervalUnit: subscription_type === "Monthly" ? "month" : "year",
// //           intervalCount: 1
// //         }
// //       ],
// //       country: "US",
// //       currency: "USD"
// //     })

// //     if (error) {
// //       Alert.alert("Error", error?.message)
// //     } else {
// //       const { error: confirmError } = await confirmApplePayPayment(clientSecret)

// //       if (confirmError) {
// //         console.log(confirmError)
// //         Alert.alert("Error", confirmError)
// //       } else {
// //         onPaymentSuccess()
// //       }
// //     }
// //   }

// //   const onGooglePayPressed = async () => {
// //     if (!isTermsAndConditionsChecked) {
// //       Alert.alert(
// //         "Error",
// //         "Please accept terms and conditions before proceeding."
// //       )
// //       return
// //     }

// //     if (!(await isGooglePaySupported({ testEnv: true }))) {
// //       Alert.alert("Google Pay is not supported on your device.")
// //       return
// //     }

// //     const { error } = await presentGooglePay({
// //       clientSecret,
// //       forSetupIntent: false
// //     })

// //     if (error) {
// //       Alert.alert(error.code, error.message)
// //       return
// //     }
// //     onPaymentSuccess()
// //   }

//   const onTermsAndConditionPress = () => {
//     console.log("terms and conditions pressed.")
//     navigation.navigate("PaymentTermsAndConditionScreen", {
//       fromScreen: "payment"
//     })
//   }

//   return (
//     <StripeProvider
//       merchantIdentifier="merchant.com.crowdbotics.flashcard"
//       publishableKey="pk_test_51IzGBmJl7wgmc2AnmtyclFpPmZGAdlGUq6SC9cOgpCZIWlV2D6FCEuI60vXpmkmtDQnAex41y8jzWLSqaGWxokcj003RSzlhLd"
//     >
//       <StripeContainer keyboardShouldPersistTaps={false}>
//         <ScrollView
//           style={styles.container}
//           contentContainerStyle={{ flexGrow: 1 }}
//         >
//           <TouchableWithoutFeedback
//             onPress={() => {
//               Keyboard.dismiss()
//               console.log("Hello world")
//             }}
//             accessible={false}
//           >
//             <View style={{ height: "100%" }}>
//               <View style={styles.content}>
//                 <View style={styles.total}>
//                   <Text category="h6">{subscription_type}</Text>
//                   <Text
//                     category="h6"
//                     style={
//                       couponObject ? { textDecorationLine: "line-through" } : {}
//                     }
//                   >
//                     {prices?.currency}
//                     {subscription_amount}
//                   </Text>
//                 </View>
//                 {couponObject ? (
//                   <View style={styles.promoButtonContainer}>
//                     <Text category="h6">{couponObject.id}</Text>
//                     <Text category="h6">
//                       ({discountAmountStr}) -{prices?.currency}
//                       {discountAmount}
//                     </Text>
//                   </View>
//                 ) : null}
//                 <View style={styles.total}>
//                   <Text category="h6">Total Payable</Text>
//                   <Text category="h6">
//                     {prices?.currency}
//                     {subscription_amount - discountAmount}
//                   </Text>
//                 </View>

//                 <View style={styles.spacer}></View>
//               </View>
//               <View style={styles.content}>
//                 <View style={styles.btnWrapper}>
//                   {Platform.OS === "android" ? (
//                     <Button
//                       status="control"
//                       style={styles.btn}
//                       onPress={onGooglePayPressed}
//                     >
//                       <View>
//                         <Image
//                           source={require("@assets/images/googlePay.png")}
//                         />
//                       </View>
//                     </Button>
//                   ) : (
//                     <Button
//                       status="control"
//                       onPress={onApplePayPress}
//                       style={styles.btn}
//                     >
//                       <View>
//                         <Image
//                           source={require("@assets/images/applePay.png")}
//                         />
//                       </View>
//                     </Button>
//                   )}
//                 </View>
//               </View>
//               <Card style={styles.card}>
//                 <View style={styles.cardContent}>
//                   <Text category="h6">Credit Card</Text>
//                   <CardForm
//                     onFormComplete={cardDetails => {
//                       console.log(cardDetails)
//                       if (cardDetails?.complete) {
//                         setFormComplete(true)
//                       } else {
//                         setFormComplete(false)
//                       }
//                     }}
//                     cardStyle={{
//                       backgroundColor:
//                         Appearance.getColorScheme() == "dark"
//                           ? "#000000"
//                           : "#ffffff"
//                     }}
//                     style={{
//                       width: "100%",
//                       marginTop: 30,
//                       marginBottom: Platform.OS === "ios" ? 50 : 10,
//                       height: Platform.OS === "ios" ? 200 : 320
//                     }}
//                   />

//                   <View style={styles.checkboxContainer}>
//                     <CheckBox
//                       checked={isTermsAndConditionsChecked}
//                       onChange={setIsTermsAndConditionsChecked}
//                       style={styles.checkbox}
//                     />

//                     <View style={styles.checkboxLabel}>
//                       <Text style={styles.labelFirstHalf}>Agree to </Text>
//                       <Pressable onPress={onTermsAndConditionPress}>
//                         <Text style={styles.termsAndConditionsText}>
//                           Terms and Conditions
//                         </Text>
//                       </Pressable>
//                     </View>
//                   </View>

//                   <Button
//                     accessoryLeft={
//                       loading ? <ActivityIndicator color={"white"} /> : null
//                     }
//                     onPress={onPayCreditCard}
//                     disabled={
//                       loading || !formComplete || !isTermsAndConditionsChecked
//                     }
//                   >
//                     PAY WITH CARD
//                   </Button>
//                 </View>
//               </Card>
//               <SafeAreaView
//                 style={{ backgroundColor: "#ffff" }}
//                 edges={["bottom"]}
//               />
//             </View>
//           </TouchableWithoutFeedback>
//         </ScrollView>
//       </StripeContainer>
//     </StripeProvider>
//   )
// }

// export default PaymentMethod

// const themedStyles = StyleService.create({
//   container: {
//     backgroundColor: "background-basic-color-1",
//     flex: 1
//   },
//   content: {
//     paddingHorizontal: 18,
//     paddingVertical: 20
//   },
//   total: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10
//   },
//   btn: {
//     width: "45%"
//   },
//   btnWrapper: {
//     flexDirection: "row",
//     justifyContent: "space-around"
//   },
//   card: {
//     flex: 1,
//     marginBottom: 0,
//     borderBottomRightRadius: 0,
//     borderBottomLeftRadius: 0
//   },
//   cardContent: {
//     flex: 1,
//     paddingHorizontal: 18,
//     paddingVertical: 20
//   },
//   input: {
//     marginBottom: 20
//   },
//   formGroup: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10
//   },
//   termContent: {
//     flexDirection: "row",
//     alignItems: "center"
//   },
//   term: {
//     textDecorationLine: "underline"
//   },
//   promoButtonContainer: {
//     marginVertical: 25,
//     marginBottom: 35,
//     flexDirection: "row",
//     justifyContent: "space-between"
//   },
//   spacer: {
//     borderBottomColor: "#E4E4E4",
//     borderBottomWidth: 1,
//     marginTop: 10
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     marginBottom: 35
//   },
//   checkbox: {
//     alignSelf: "center"
//   },
//   checkboxLabel: {
//     margin: 11,
//     flexDirection: "row"
//   },
//   labelFirstHalf: {
//     color: "#656E78",
//     fontSize: 16,
//     lineHeight: 19,
//     fontFamily: "Gilroy-Light",
//     letterSpacing: 0.5
//   },
//   termsAndConditionsText: {
//     textDecorationLine: "underline",
//     color: "#656E78",
//     fontSize: 16,
//     lineHeight: 19,
//     fontFamily: "Gilroy-Light",
//     letterSpacing: 0.5
//   }
// })
