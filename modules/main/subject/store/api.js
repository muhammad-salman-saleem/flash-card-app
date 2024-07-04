import httpClient from "../../../httpClient"

function getDecks(category_id) {
    return httpClient.get(`/api/v1/decks/?category__id=${category_id}`)
}

export const api = {
    getDecks,
}