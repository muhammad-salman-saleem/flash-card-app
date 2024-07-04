import httpClient from "../../../httpClient"

function getQuestions(deck_id) {
    return httpClient.get(`/api/v1/questions/?deck__id=${deck_id}`)
}

function attemptQuestion(question) {
    return httpClient.post(`/api/v1/questions_attempted/`, question)
}

export const api = {
    getQuestions,
    attemptQuestion
}