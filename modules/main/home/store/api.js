import httpClient from "../../../httpClient"

function getCategories() {
    return httpClient.get(`/api/v1/category/`)
}

export const api = {
    getCategories,
}