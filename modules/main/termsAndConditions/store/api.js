import httpClient from "../../../httpClient"

function getTermsAndConditions() {
    return httpClient.get(`/modules/terms_and_conditions/`)
}

export const api = {
    getTermsAndConditions
}