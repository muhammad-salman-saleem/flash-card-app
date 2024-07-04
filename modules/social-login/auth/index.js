import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getServerError, mapErrorMessage } from "./utils"
import { api } from "./api"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const loginRequest = createAsyncThunk(
  "login/loginRequest",
  async payload => {
    try {
      const response = await api.apiLoginRequest(payload)
      return response.data
    } catch (err) {
      let errorMsg = getServerError(err.response?.data) || JSON.stringify(err.response || err);
      throw new Error(errorMsg)
    }

  }
)

export const signupRequest = createAsyncThunk(
  "login/signupRequest",
  async payload => {
    try {
      const response = await api.apiSignupRequest(payload)
      return response.data
    } catch (err) {
      let errorMsg = getServerError(err.response?.data) || JSON.stringify(err.response || err);
      throw new Error(errorMsg)
    }

  }
)

export const logoutRequest = createAsyncThunk(
  "login/logoutRequest",
  async payload => {
    const response = await AsyncStorage.removeItem("@token")
    return response
  }
)

export const getAuthUser = createAsyncThunk(
  "login/getAuthUser",
  async payload => {
    const response = await api.apiAuthUserRequest(payload)
    return response.data
  }
)

export const postDeactivateUser = createAsyncThunk(
  "login/postDeactivateUser",
  async token => {
    try {
      const response = await api.apiDeactivateUserRequest(token)
      await AsyncStorage.removeItem("@token")
      return response.data
    } catch (err) {
      let errorMsg = getServerError(err.response?.data) || JSON.stringify(err.response || err);
      throw new Error(errorMsg)
    }
  }
)

export const postChangePassowrd = createAsyncThunk(
  "login/postChangePassowrd",
  async payload => {

    try {
      const response = await api.apiChangePasswordRequest(payload)
      return response.data

    } catch (err) {
      let errorMsg = getServerError(err.response?.data) || JSON.stringify(err.response || err);
      throw new Error(errorMsg)
    }

  }
)

export const resetPassword = createAsyncThunk(
  "login/resetPassword",
  async payload => {
    try {
      const response = await api.apiResetPasswordRequest(payload)
      return response.data
    } catch (error) {
      let errorMsg = getServerError(error.response?.data) || JSON.stringify(error.response || error);
      throw new Error(errorMsg)
    }

  }
)

export const resetPasswordConfirm = createAsyncThunk(
  "login/resetPasswordConfirm",
  async payload => {
    try {

      const response = await api.apiResetPasswordConfirmRequest(payload)
      return response.data

    } catch (error) {

      let errorMsg = getServerError(error.response?.data) || JSON.stringify(error.response || error);

      throw new Error(errorMsg)
    }
  }
)

export const facebookLogin = createAsyncThunk(
  "login/facebookLogin",
  async payload => {
    const response = await api.apiFacebookLogin(payload)
    return response.data
  }
)

export const googleLogin = createAsyncThunk(
  "login/googleLogin",
  async payload => {
    const response = await api.apiGoogleLogin(payload)
    return response.data
  }
)
export const appleLogin = createAsyncThunk(
  "login/appleLogin",
  async payload => {
    const response = await api.apiAppleLogin(payload)
    return response.data
  }
)

export const updateUserById = createAsyncThunk(
  "userProfile/updateUserById",
  async payload => {
    const response = await api.updateUserById(payload)
    return response.data
  }
)

export const patchUserById = createAsyncThunk(
  "userProfile/patchUserById",
  async payload => {
    const response = await api.apiPatchUser(payload)
    return response.data
  }
)

export const updateUserImage = createAsyncThunk(
  "userProfile/updateProfile",
  async (payload) => {
    try {
      const response = await api.updateProfileImage(payload.id, payload.image)
      return response.data
    } catch (error) {
    }

  }
)


const initialState = {
  token: null,
  user: null,
  resetPasswordMessage: null,
  api: { loading: false, error: null }
}
export const slice = createSlice({
  name: "login",
  initialState: initialState,
  reducers: {
    resetMessages: (state) => {
      state.resetPasswordMessage = null
      state.api.error = null
    },
    updateUserUpgradeStatus: (state, action) => {
      state.user.payment_done = action.payload
    }
  },
  extraReducers: {
    [loginRequest.pending]: state => {
      state.api.loading = true
      state.api.error = null
    },
    [loginRequest.fulfilled]: (state, action) => {
      state.token = action.payload?.token

      if (action.payload?.user) {
        let name = (action.payload.user.first_name || action.payload.user.last_name) && action.payload.user.first_name + " " + action.payload.user.last_name

        let user = {
          ...action.payload.user,
          ...action.payload.profile,
          name: action.payload.user.name?.length > 1 ? action.payload.user.name : name
        };

        state.user = user
      }

      state.api.loading = false
    },
    [loginRequest.rejected]: (state, action) => {
      state.api.error = mapErrorMessage(action.error)
      state.api.loading = false
    },

    [signupRequest.pending]: state => {
      state.api.loading = true
      state.api.error = null
      state.token = null
    },
    [signupRequest.fulfilled]: (state, action) => {
      state.user = action.payload?.user
      state.api.loading = false
    },
    [signupRequest.rejected]: (state, action) => {
      state.api.error = action.error
      state.api.loading = false
    },

    [logoutRequest.pending]: state => {
      state.api.loading = true
      state.api.error = null
    },
    [logoutRequest.fulfilled]: state => {
      return initialState
    },
    [logoutRequest.rejected]: (state, action) => {
      state.api.error = mapErrorMessage(action.error)
      state.api.loading = false
    },
    [getAuthUser.pending]: state => {
      state.api.loading = true
      state.api.error = null
    },
    [getAuthUser.fulfilled]: (state, action) => {
      let name = (action.payload.first_name || action.payload.last_name) && action.payload.first_name + " " + action.payload.last_name
      state.user = {
        ...action.payload.profile,
        ...action.payload,
        name: action.payload.name?.length > 1 ? action.payload.name : name
      }
      state.api.loading = false
      state.api.error = null
    },
    [getAuthUser.rejected]: (state, action) => {
      //state.api.error = mapErrorMessage(action.error)
      state.api.loading = false
    },
    [postDeactivateUser.pending]: state => {
      state.api.loading = true
      state.api.error = null
    },
    [postDeactivateUser.fulfilled]: state => {
      return initialState
    },
    [postDeactivateUser.rejected]: (state, action) => {
      state.api.error = mapErrorMessage(action.error)
      state.api.loading = false
    },
    [updateUserImage.pending]: state => {
      state.api.loading = true
      state.api.error = null
    },
    [updateUserImage.fulfilled]: (state, action) => {
      state.user = {
        ...state.user,
        profile_image: action.payload.profile_image,
      }
      state.api.loading = false
      state.api.error = null
    },
    [updateUserImage.rejected]: (state, action) => {
      state.api.error = mapErrorMessage(action.error)
      state.api.loading = false
    },
    [postChangePassowrd.pending]: state => {
      state.api.loading = true
      state.api.error = null
    },
    [postChangePassowrd.fulfilled]: state => {
      state.api.loading = false
      state.api.error = null
    },
    [postChangePassowrd.rejected]: (state, action) => {
      state.api.error = mapErrorMessage(action.error)
      state.api.loading = false
    },
    [resetPassword.pending]: state => {
      state.resetPasswordMessage = null
      state.api.loading = true
      state.api.error = null
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.resetPasswordMessage = "A reset password link has been sent to your email. Please access this link from your mobile device."
      state.api.loading = false
      state.api.error = null
    },
    [resetPassword.rejected]: (state, action) => {
      state.resetPasswordMessage = null
      state.api.loading = false
      state.api.error = action.error.message
    },
    [resetPasswordConfirm.pending]: state => {
      state.resetPasswordMessage = null
      state.api.loading = true
      state.api.error = null
    },
    [resetPasswordConfirm.fulfilled]: (state, action) => {
      state.resetPasswordMessage = "Your password has been reset!"
      state.api.loading = false
      state.api.error = null
    },
    [resetPasswordConfirm.rejected]: (state, action) => {
      state.resetPasswordMessage = null
      state.api.loading = false
      state.api.error = action.error.message
    },
    [facebookLogin.pending]: state => {
      state.api.loading = true
      state.api.error = null
    },
    [facebookLogin.fulfilled]: (state, action) => {
      state.token = action.payload?.token

      if (action.payload?.user) {
        let name = (action.payload.user.first_name || action.payload.user.last_name) && action.payload.user.first_name + " " + action.payload.user.last_name

        let user = {
          ...action.payload.user,
          ...action.payload.profile,
          name: action.payload.user.name?.length > 1 ? action.payload.user.name : name
        };

        state.user = user
      }
      state.api.error = null
      state.api.loading = false
    },
    [facebookLogin.rejected]: (state, action) => {
      state.api.error = mapErrorMessage(action.error)
      state.api.loading = false
    },
    [googleLogin.pending]: state => {
      state.api.loading = true
      state.api.error = null
    },
    [googleLogin.fulfilled]: (state, action) => {
      state.token = action.payload?.token

      if (action.payload?.user) {
        let name = (action.payload.user.first_name || action.payload.user.last_name) && action.payload.user.first_name + " " + action.payload.user.last_name
        let user = {
          ...action.payload.user,
          ...action.payload.profile,
          name: action.payload.user.name ? action.payload.user.name : name
        };

        state.user = user
      }

      state.api.error = null
      state.api.loading = false
    },
    [googleLogin.rejected]: (state, action) => {
      state.api.error = mapErrorMessage(action.error)
      state.api.loading = false
    },
    [appleLogin.pending]: state => {
      state.api.loading = true
      state.api.error = null
    },
    [appleLogin.fulfilled]: (state, action) => {
      state.token = action.payload?.token

      if (action.payload?.user) {
        let name = (action.payload.user.first_name || action.payload.user.last_name) && action.payload.user.first_name + " " + action.payload.user.last_name

        let user = {
          ...action.payload.user,
          ...action.payload.profile,
          name: action.payload.user.name?.length > 1 ? action.payload.user.name : name
        };

        state.user = user
      }

      state.api.error = null
      state.api.loading = false
    },
    [appleLogin.rejected]: (state, action) => {
      state.api.error = mapErrorMessage(action.error)
      state.api.loading = false
    },
    [updateUserById.pending]: (state, action) => {
      state.api.loading = true
    },
    [updateUserById.fulfilled]: (state, action) => {
      //state.user = action.payload
      state.api.loading = false
    },
    [updateUserById.rejected]: (state, action) => {
      state.api.error = action.error
      state.api.loading = false
    },
    [patchUserById.pending]: (state, action) => {
      state.api.loading = true
    },
    [patchUserById.fulfilled]: (state, action) => {
      state.user.name = action.meta.arg.name
      state.user.email = action.meta.arg.email
      state.api.loading = false
    },
    [patchUserById.rejected]: (state, action) => {
      state.api.error = action.error
      state.api.loading = false
    }
  }
})

export const { resetMessages, updateUserUpgradeStatus } = slice.actions

