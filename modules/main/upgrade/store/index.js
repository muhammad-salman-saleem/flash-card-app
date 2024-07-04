import { getServerError, mapErrorMessage } from "@modules/social-login/auth/utils"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "./api"

export const createCustomer = createAsyncThunk(
  "payments/createCustomer",
  async () => {
    const response = await api.createCustomer()
    return response.data
  }
)

export const getSubscriptionPrices = createAsyncThunk(
  "payments/getSubscriptionPrices",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.getSubscriptionPrices()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }

  }
)

export const validateCoupon = createAsyncThunk(
  "payments/validateCoupon",
  async (coupon) => {
    try {
      const response = await api.validateCoupon(coupon)
      return response.data
    } catch (err) {
      let errorMsg = getServerError(err.response?.data) || JSON.stringify(err.response || err);
      throw new Error(errorMsg)
    }
  }
)

export const createSubscription = createAsyncThunk(
  "payments/createSubscription",
  async ({ type, coupon }) => {
    const response = await api.createSubscription({ type, coupon })
    return response.data
  }
)

export const getSubscription = createAsyncThunk(
  "payments/getSubscription",
  async () => {
    const response = await api.getSubscription()
    return response.data
  }
)

const initialState = {
  prices: {},
  coupon: null,
  subscription: null,
  subscriptionObject: null,
  api: {
    loading: {
      validateCoupon: false,
      createCustomer: true,
      getSubscriptionPrices: true,
      createSubscription: false,
      getSubscription: true,
    },
    error: null,
    couponError: null,
    createSubscriptionError: null,
    getPricesError: null,
    createCustomerError: null,
    getSubscriptionError: null
  }
}

export const slice = createSlice({
  name: "payments",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createCustomer.pending, (state, action) => {
      state.api.loading.createCustomer = true;
      state.api.createCustomerError = null;
    })
    builder.addCase(createCustomer.fulfilled, (state, action) => {
      state.api.loading.createCustomer = false;
      state.faqs = action.payload
    })
    builder.addCase(createCustomer.rejected, (state, action) => {
      state.api.loading.createCustomer = false;
      state.api.createCustomerError = action.payload?.error;
    })

    builder.addCase(getSubscriptionPrices.pending, (state, action) => {
      state.api.loading.getSubscriptionPrices = true;
      state.api.getPricesError = null;
    })
    builder.addCase(getSubscriptionPrices.fulfilled, (state, action) => {
      state.api.loading.getSubscriptionPrices = false;
      state.prices = action.payload
    })
    builder.addCase(getSubscriptionPrices.rejected, (state, action) => {
      state.api.loading.getSubscriptionPrices = false;
      state.api.getPricesError = action.payload?.error
    })

    // validate coupon
    builder.addCase(validateCoupon.pending, (state, action) => {
      state.api.loading.validateCoupon = true;
      state.api.couponError = null;
      state.coupon = null;
    })
    builder.addCase(validateCoupon.fulfilled, (state, action) => {
      state.api.loading.validateCoupon = false;
      state.coupon = action.payload
      console.log("Action:", action)
    })
    builder.addCase(validateCoupon.rejected, (state, action) => {
      state.api.loading.validateCoupon = false;
      const error = mapErrorMessage(action.error)
      state.api.couponError = error.message
    })

    // createSubscription
    builder.addCase(createSubscription.pending, (state, action) => {
      state.api.loading.createSubscription = true;
      state.api.couponError = null;
      state.subscription = null;
    })
    builder.addCase(createSubscription.fulfilled, (state, action) => {
      state.api.loading.createSubscription = false;
      state.subscription = action.payload
      console.log("Action:", action)
    })
    builder.addCase(createSubscription.rejected, (state, action) => {
      state.api.loading.createSubscription = false;
      console.log("Action:", action)
      state.api.createSubscriptionError = "Unable to create subscription"
    })

    // getSubscription
    builder.addCase(getSubscription.pending, (state, action) => {
      state.api.loading.getSubscription = true;
      state.api.couponError = null;
      state.subscriptionObject = null;
      state.api.getSubscriptionError = null;
    })
    builder.addCase(getSubscription.fulfilled, (state, action) => {
      state.api.loading.getSubscription = false;
      state.subscriptionObject = action.payload
    })
    builder.addCase(getSubscription.rejected, (state, action) => {
      state.api.loading.getSubscription = false;
      console.log("Action:", action.error)
      state.api.getSubscriptionError = "Unable to get subscription data from stripe."
    })
  },
})
