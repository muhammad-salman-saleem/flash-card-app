import httpClient from "../../../httpClient"

function getFAQs() {
    return httpClient.get(`/api/v1/faq/`)
}

export const api = {
    getFAQs,
}