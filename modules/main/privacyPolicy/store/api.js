import httpClient from "../../../httpClient"

function getPrivacyPolicy() {
    return httpClient.get(`/modules/privacy_policy/`)
}

export const api = {
    getPrivacyPolicy
}