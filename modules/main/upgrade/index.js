import React, { useEffect, useState } from "react"
import { View, Image, ActivityIndicator, Platform } from "react-native"
import {
  Text,
  StyleService,
  useStyleSheet,
  Button,
  Toggle,
  useTheme
} from "@ui-kitten/components"
import { Card, BackButton } from "@components"
import { useSelector, useDispatch } from "react-redux"
import { createCustomer, getSubscription, getSubscriptionPrices } from "./store"
import { useFocusEffect } from "@react-navigation/native"
import {
  initConnection,
  endConnection,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getProducts,
  requestPurchase
} from "react-native-iap"

const Upgrade = ({ navigation, HeaderLeft }) => {
  const styles = useStyleSheet(themedStyles)
  const [checked, setChecked] = useState(false)
  const user = useSelector(state => state.login.user)
  const api = useSelector(state => state.payments.api)
  const prices = useSelector(state => state.payments.prices)
  const subscriptionObject = useSelector(
    state => state.payments.subscriptionObject
  )
  const dispatch = useDispatch()
  const theme = useTheme()

  useFocusEffect(
    React.useCallback(() => {
      dispatch(createCustomer())
      dispatch(getSubscriptionPrices())
      dispatch(getSubscription())
    }, [])
  )

  useEffect(() => {
    navigation.setOptions({
      title: <Text category="s1">UPGRADE</Text>,
      headerLeft: () =>
        HeaderLeft ? <HeaderLeft /> : <BackButton navigation={navigation} />
    })
  }, [])

  useEffect(() => {
    const interval = subscriptionObject?.plan?.interval
    if (interval == "year") {
      setChecked(true)
    }
  }, [subscriptionObject])

  const onCheckedChange = isChecked => {
    setChecked(isChecked)
  }

  const onUpgradePress = () => {
    if (Platform.OS == "ios") {
      const yearlyProductId = "ios_straight_nursing_yearly_49_99"
      const monthlyProductId = "ios_straight_nursing_monthly_5_99"
      // create subscription
      makePurchase(checked ? yearlyProductId : monthlyProductId)
    } else {
      navigation.navigate("Checkout", {
        subscription_amount: checked
          ? prices?.yearly_price
          : prices?.monthly_price,
        subscription_type: checked ? "Yearly" : "Monthly"
      })
    }
  }

  const [products, setProducts] = useState([])
  const initializeConnection = async () => {
    try {
      await initConnection()
      if (Platform.OS === "android") {
        await flushFailedPurchasesCachedAsPendingAndroid()
      }
    } catch (error) {
      console.error("An error occurred", error.message)
    }
  }
  // const purchaseUpdatedListener = purchaseUpdatedListener(purchase => {
  //   console.log("purchaseUpdatedListener", purchase)
  //   const receipt = purchase.transactionReceipt
  //   if (receipt) {
  //     yourAPI
  //       .deliverOrDownloadFancyInAppPurchase(purchase.transactionReceipt)
  //       .then(async deliveryResult => {
  //         if (isSuccess(deliveryResult)) {
  //           // Tell the store that you have delivered what has been paid for.
  //           // Failure to do this will result in the purchase being refunded on Android and
  //           // the purchase event will reappear on every relaunch of the app until you succeed
  //           // in doing the below. It will also be impossible for the user to purchase consumables
  //           // again until you do this.

  //           // If consumable (can be purchased again)
  //           await finishTransaction({ purchase, isConsumable: true })
  //           // If not consumable
  //           await finishTransaction({ purchase, isConsumable: false })
  //         } else {
  //           // Retry / conclude the purchase is fraudulent, etc...
  //         }
  //       })
  //   }
  // })

  purchaseUpdatedListener(async purchase => {
    console.log(purchase)
    if (purchase.purchaseStateAndroid === "Purchased") {
      // Purchase successful, grant access to the purchased item
      console.log("Purchase successful:", purchase.productId)
    } else if (purchase.purchaseStateAndroid === "Restored") {
      // Purchase restored, grant access to the restored item
      console.log("Purchase restored:", purchase.productId)
    }
  })

  useEffect(() => {
    initializeConnection()
    purchaseUpdatedListener()
    // purchaseError()
    fetchProducts()
    return () => {
      endConnection()
      // purchaseUpdate.remove()
      // purchaseError.remove()
    }
  }, [])

  const fetchProducts = async () => {
    try {
      const products = await getProducts({
        skus: Platform.select({
          ios: [
            "ios_straight_nursing_monthly_5_99",
            "ios_straight_nursing_yearly_49_99"
          ]
          // android: ["com.rniap.product100", "com.rniap.product200"]
        })
      })
      setProducts(products)
      // console.log(products)
    } catch (error) {
      console.error("Error occurred while fetching products", error.message)
    }
  }
  const makePurchase = async sku => {
    try {
      requestPurchase({ sku })
    } catch (error) {
      console.error("Error making purchase", error.message)
    }
  }

  return (
    <View style={styles.container}>
      {api.getPricesError ||
      api.createCustomerError ||
      api.getSubscriptionError ? (
        <View>
          {api.getPricesError ? (
            <Text status="danger" style={{ textAlign: "center" }}>
              {api.getPricesError}
            </Text>
          ) : (
            <></>
          )}
          {api.createCustomerError ? (
            <Text status="danger" style={{ textAlign: "center" }}>
              {api.createCustomerError}
            </Text>
          ) : (
            <></>
          )}
          {api.getSubscriptionError ? (
            <Text status="danger" style={{ textAlign: "center" }}>
              {api.getSubscriptionError}
            </Text>
          ) : (
            <></>
          )}
        </View>
      ) : api.loading.createCustomer ||
        api.loading.getSubscriptionPrices ||
        api.loading.getSubscription ? (
        <View style={styles.loaderContent}>
          <ActivityIndicator color={theme["color-primary-500"]} />
        </View>
      ) : (
        <Card>
          <View style={styles.content}>
            <View style={styles.body}>
              <Text category="h5" style={{ marginBottom: 10 }}>
                Premium Plan
              </Text>
              <Text category="h4" status="success">
                {!checked
                  ? prices?.currency + prices?.monthly_price
                  : prices?.currency + prices?.yearly_price}
              </Text>
              <View style={styles.toggleContent}>
                <Text category="s1" appearance={checked ? "hint" : "default"}>
                  Pay Monthly
                </Text>
                <Toggle
                  status="success"
                  disabled={subscriptionObject?.status === "active"}
                  checked={checked}
                  onChange={onCheckedChange}
                />
                <Text category="s1" appearance={!checked ? "hint" : "default"}>
                  Pay Yearly
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.optionContent}>
              <View style={styles.option}>
                <Image source={require("@assets/images/check.png")} />
                <Text category="h6" style={styles.text}>
                  All Decks Unlocked
                </Text>
              </View>
              <View style={styles.option}>
                <Image source={require("@assets/images/check.png")} />
                <Text category="h6" style={styles.text}>
                  Access Thousands of Cards
                </Text>
              </View>
              <View style={styles.option}>
                <Image source={require("@assets/images/check.png")} />
                <Text category="h6" style={styles.text}>
                  Repeat Missed Cards{" "}
                </Text>
              </View>
            </View>
            {subscriptionObject?.status === "active" ? (
              <Text status="success" style={{ textAlign: "center" }}>
                Your account has been successfully upgraded
              </Text>
            ) : (
              <Button onPress={onUpgradePress}>UPGRADE</Button>
            )}
          </View>
        </Card>
      )}
    </View>
  )
}

export default Upgrade

const themedStyles = StyleService.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 20
  },
  content: {
    padding: 20,
    paddingHorizontal: 30
  },
  body: {
    alignItems: "center"
  },
  toggleContent: {
    paddingTop: 15,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  text: {
    marginLeft: 15
  },
  option: {
    flexDirection: "row",
    marginBottom: 10
  },
  optionContent: {
    margin: 10,
    marginBottom: 30
    // flex: 1,
  },
  divider: {
    marginVertical: 20,
    width: "100%",
    borderTopWidth: 1,
    borderColor: "#F4EFED"
  },
  loaderContent: {
    flex: 1,
    alignItems: "center"
  }
})
