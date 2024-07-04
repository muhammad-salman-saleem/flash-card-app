import httpClient from "../../../httpClient"

function getResources() {
    return httpClient.get(`/api/v1/resources/`)
}

export const api = {
    getResources
}