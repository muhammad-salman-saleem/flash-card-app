// Please, update the values below as instructed in the README.md file.
export const GOOGLE_WEB_CLIENT_ID =
  "133072641319-fble1bbcgm2crd6rkjipi3b5gfg4qdje.apps.googleusercontent.com"
export const GOOGLE_IOS_CLIENT_ID = "YYYYYY.apps.googleusercontent.com"
export const APPLE_SERVICE_ID = "com.crowdbotics.APP_NAME"
export const APPLE_REDIRECT_CALLBACK =
  "https://your-app-here.com/accounts/apple/login/callback/"

// -----------------------------------------------------
const messageMap = {
  "Request failed with status code 400": {
    code: 400,
    message: "Invalid credentials."
  },
  "Request failed with status code 403": {
    code: 403,
    message: "You do not have access to this resource."
  },
  "Request failed with status code 500": {
    code: 500,
    message: "Unexpected Server Error."
  },
  "Network Error": {
    code: null,
    message:
      "Network Error: It was not possible to establish a connection with the server."
  }
}

export const mapErrorMessage = error => {
  const message = error.message
  return messageMap[message]
    ? { ...messageMap[message] }
    : { code: null, message }
}

export const getDisplayNameFromFieldName = name => {
  switch (name) {
    case "new_password1":
      return "password"
    case "new_password2":
      return "password"
    case "last_name":
      return "last name"
    default:
      return name
  }
}

export const getServerError = (errorObject, errorMessage) => {
  if (errorObject) {
    try {
      if (typeof errorObject === "string") {
        return errorObject
      }

      const fields = Object.keys(errorObject)
      const messages = []

      fields.forEach(fieldName => {
        const message = errorObject[fieldName]
        if (fieldName === "non_field_errors") {
          if (typeof message === "string") {
            messages.push(`${message}`)
          } else if (typeof message === "object") {
            const messageContentData = Object.values(message)
            const messageContent = messageContentData && messageContentData[0]

            messages.push(`${messageContent}`)
          }
        } else {
          const displayName = getDisplayNameFromFieldName(fieldName)
          if (typeof message === "string") {
            messages.push(
              !Number.isNaN(Number(displayName)) ? message : `${message}`
            )
          } else if (typeof message === "object") {
            const messageContentData = Object.values(message)
            const messageContent = messageContentData && messageContentData[0]

            messages.push(
              !Number.isNaN(Number(displayName))
                ? messageContent
                : `${messageContent}`
            )
          }
        }
      })

      return messages.join(" ~ ")
    } catch (e) {
      console.log("e :>> ", e)
      return errorMessage
    }
  }

  return null
}
