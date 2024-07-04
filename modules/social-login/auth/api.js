import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { Platform } from "react-native"
import httpClient, { SERVICE_URL } from "../../httpClient"

function apiLoginRequest(payload) {
  return httpClient.post(`/rest-auth/login/`, payload, {
    headers: { Authorization: "" }
  })
}

function apiSignupRequest(payload) {
  return httpClient.post(`/rest-auth/registration/`, payload, {
    headers: { Authorization: "" }
  })
}

function apiLogoutRequest() {
  return httpClient.post(`/rest-auth/logout/`, null)
}

function apiAuthUserRequest(payload) {
  return httpClient.get(`/api/v1/user-info/`, {
    headers: { Authorization: `Token ${payload}` }
  })
}

function apiDeactivateUserRequest(payload = {}) {
  return httpClient.post(`/api/v1/user/delete/`, payload)
}

function apiChangePasswordRequest(payload) {
  return httpClient.post(`/rest-auth/password/change/`, payload)
}

function apiResetPasswordRequest(payload) {
  return httpClient.post(`/api/password_reset/`, payload, {
    headers: { Authorization: "" }
  })
}

function apiResetPasswordConfirmRequest(payload) {
  return httpClient.post(`/api/password_reset/confirm/`, payload, {
    headers: { Authorization: "" }
  })
}

function apiFacebookLogin(payload) {
  return httpClient.post(`/api/v1/facebook/login/`, payload, {
    headers: { Authorization: "" }
  })
}

function apiGoogleLogin(payload) {
  return httpClient.post(`/api/v1/google/login/`, payload, {
    headers: { Authorization: "" }
  })
}

function apiGoogleConnect(payload) {
  return httpClient.post(`/api/v1/google/connect/`, payload, {
    headers: { Authorization: "" }
  })
}

function apiAppleLogin(payload) {
  return httpClient.post(`/api/v1/apple/login/`, payload, {
    headers: { Authorization: "" }
  })
}

function updateUserById(payload) {
  var data = new FormData();
  const { id, ...reset } = payload

  Object.keys(reset).forEach((label) => {
    data.append([label], reset[label])
  })

  return httpClient.patch(
    `/api/v1/update_profile/${id}/`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
}

function apiPatchUser(payload) {
  const { id, ...reset } = payload
  console.log("Id: ", id, "Rest: ", reset)
  return httpClient.patch(`/api/v1/user/${id}/`, reset)
}

async function updateProfileImage(id, image) {
  var data = new FormData();

  data.append("profile_image", {
    name: image.fileName,
    type: image.type,
    uri:
      Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
  })

  let token = await AsyncStorage.getItem("@token")

  return axios({
    url: `${SERVICE_URL}/api/v1/update_profile/${id}/`,
    method: 'PATCH',
    headers: {
      'Authorization': "Token " + JSON.parse(token),
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}

export const api = {
  apiLoginRequest,
  apiSignupRequest,
  apiLogoutRequest,
  apiResetPasswordRequest,
  apiResetPasswordConfirmRequest,
  apiAuthUserRequest,
  apiFacebookLogin,
  apiGoogleLogin,
  apiGoogleConnect,
  apiAppleLogin,
  updateUserById,
  updateProfileImage,
  apiDeactivateUserRequest,
  apiChangePasswordRequest,
  apiPatchUser
}


