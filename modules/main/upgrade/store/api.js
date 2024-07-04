import httpClient from "../../../httpClient"

function createCustomer() {
    return httpClient.post(`/stripe/create_customer/`, {})
}

function getSubscriptionPrices() {
    return httpClient.get(`/stripe/get_subscription_prices/`)
}

function validateCoupon(coupon) {
    return httpClient.post(`/stripe/validate_coupon/`, { coupon })
}

function createSubscription({type, coupon}) {
    let request = {type};

    if (coupon) {
        request["coupon"] = coupon;
    }

    console.log("Request: ", request)

    return httpClient.post(`/stripe/create_subscription/`, request)
}

function getSubscription() {
    return httpClient.get(`/stripe/get_subscription/`)
}

export const api = {
    createCustomer,
    getSubscriptionPrices,
    validateCoupon,
    createSubscription,
    getSubscription
}
