import React, { useEffect, useState } from 'react'
import { Image, Pressable, View, ActivityIndicator } from 'react-native'
import { Text, StyleService, useStyleSheet, Button, Input, CheckBox } from '@ui-kitten/components'
import { Card, BackButton } from '@components'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SafeAreaView } from 'react-native-safe-area-context'
import PromoModal from './PromoModal'
import { StripeProvider } from '@stripe/stripe-react-native'
import { useDispatch, useSelector } from 'react-redux'
import { createSubscription, validateCoupon } from '../store'


const Checkout = ({ navigation, route }) => {
    const styles = useStyleSheet(themedStyles)
    const [modalVisible, setModalVisible] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountAmountStr, setDiscountAmountStr] = useState(null);
    const { subscription_amount, subscription_type } = route.params;
    const [ couponObject, setCouponObject ] = useState(null);
    const [ prices, setPrices ] = useState(null);

    const dispatch = useDispatch();
    const _couponObject = useSelector(state => state.payments.coupon);
    const _prices = useSelector(state => state.payments.prices);
    const subscription = useSelector(state => state.payments.subscription);
    const api = useSelector(state => state.payments.api);

    useEffect(() => {
        navigation.setOptions({
            title: <Text category="s1">Checkout</Text>,
            headerLeft: () => <BackButton navigation={navigation} />
        });
    }, []);

    useEffect(() => {
        if (_couponObject) {
            setCouponObject(_couponObject);
        }
    }, [_couponObject]);

    useEffect(() => {
        if (_prices) {
            setPrices(_prices);
        }
    }, [_prices]);

    useEffect(() => {
        if (couponObject) {
            console.log(couponObject, subscription_amount)
            setModalVisible(false);

            const off = couponObject?.percent_off ? `${couponObject?.percent_off}% off` : `$${couponObject?.amount_off} off`;
            setDiscountAmountStr(off);

            const discount = couponObject?.percent_off ? ((subscription_amount/100) * couponObject?.percent_off) : couponObject?.amount_off;
            setDiscountAmount(discount.toFixed(2));
        }
    }, [subscription_amount, couponObject]);

    useEffect(() => {
        if (subscription) {
            navigation.navigate('PaymentMethod', {...subscription, subscription_amount, subscription_type, prices, couponObject})
        }
    }, [subscription]);


    const onApplyCoupon = () => {
        dispatch(validateCoupon(coupon));
    }

    const onCheckoutPress = () => {
        console.log(subscription_type.toLowerCase(), couponObject?.id);
        dispatch(createSubscription({type: subscription_type.toLowerCase(), coupon: couponObject?.id}));
    }

    return (
        <View style={styles.container}>

            <PromoModal
                api={api}
                coupon={coupon}
                setCoupon={setCoupon}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                onApplyCoupon={onApplyCoupon} />

            <View style={styles.content}>

                <View style={styles.total}>
                    <Text category="h6">{subscription_type} Subscription</Text>
                    <Text 
                        category="h6"
                        style={couponObject ? {textDecorationLine: 'line-through'} : {}}>{prices?.currency}{subscription_amount}</Text>
                </View>

                <View style={styles.promoButtonContainer}>
                    {couponObject ? 
                        <>
                        <Text category="h6">{couponObject?.id}</Text>
                        <Text category="h6">({discountAmountStr}) -{prices?.currency}{discountAmount}</Text>
                        </>  
                    :
                    <Pressable
                        onPress={() => setModalVisible(true)}
                        style={styles.promoButton}
                    >
                        <Text style={styles.promoButtonText} category="h6">+ Add promo code</Text>
                    </Pressable>
                    }
                </View>

                <View style={styles.total}>
                    <Text category="h6">Total</Text>
                    <Text category="h6">{prices?.currency}{subscription_amount-discountAmount}</Text>
                </View>

                <View style={styles.spacer}></View>
                <Button disabled={api.loading.createSubscription} accessoryLeft={api.loading.createSubscription ? <ActivityIndicator color={'white'} /> : null} onPress={onCheckoutPress}>Checkout</Button>
            </View>
        </View>
    )
}

export default Checkout

const themedStyles = StyleService.create({
    container: {
        backgroundColor: 'background-basic-color-1',
        flex: 1,
    },
    content: {
        paddingHorizontal: 18,
        paddingVertical: 20,
    },
    total: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    btn: {
        width: '45%'
    },
    btnWrapper: {
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    card: {
        flex: 1,
        marginBottom: 0,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 18,
        paddingVertical: 20,
    },
    input: {
        marginBottom: 20
    },
    formGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    termContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    term: {
        textDecorationLine: 'underline'
    },
    promoButton: {},
    promoButtonText: {
        color: '#656E78',
        fontSize: 18,
        lineHeight: 19,
        fontFamily: 'Gilroy-Light',
        letterSpacing: 0.5
    },
    promoButtonContainer: {
        marginVertical: 25,
        marginBottom: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    spacer: {
        marginVertical: 25
    }
})
