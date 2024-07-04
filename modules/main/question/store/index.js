import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "./api"

export const getQuestions = createAsyncThunk(
    "question/getQuestions",
    async (deck_id) => {
        const response = await api.getQuestions(deck_id)
        return response.data
    }
)

export const attemptQuestion = createAsyncThunk(
    "question/attemptQuestion",
    async (question) => {
        console.log("Question Payload: ", question)
        const response = await api.attemptQuestion(question)
        console.log("Question Payload: ", response)
        return response.data
    }
)


const initialState = {
    question: {},
    questions: [],
    score: 0,
    noOfCorrectAnswers: 0,
    answers: {},
    api: { loading: false, error: null, attemptQuestionLoading: false }
}

export const slice = createSlice({
    name: "question",
    initialState: initialState,
    reducers: {
        resetScore: (state) => {
            state.score = 0
            state.noOfCorrectAnswers = 0
            state.answers = {}
        },
        resetMissedAnswers: (state) => {
            Object.keys(state.answers).forEach(key => {
                if (state.answers[key] === false) {
                    delete state.answers[key];
                }
            })
        },
        updateQuestion: (state, action) => {
            const { questionAttempted } = action.payload
            state.questions = state.questions.map(item => {

                if (item.id === questionAttempted.question) {
                    item.user_answer = questionAttempted
                }

                return item
            })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getQuestions.pending, (state, action) => {
            state.api.loading = true;
            state.questions = []
        })
        builder.addCase(getQuestions.fulfilled, (state, action) => {
            state.api.loading = false;
            state.questions = action.payload
        })
        builder.addCase(getQuestions.rejected, (state, action) => {
            state.api.loading = false;
        })
        builder.addCase(attemptQuestion.pending, (state, action) => {
            state.api.attemptQuestionLoading = true;
        })
        builder.addCase(attemptQuestion.fulfilled, (state, action) => {
            console.log("Fulfilled: ", action)
            let scoreCount = 0
            let noOfCorrectAnswers = 0
            state.answers[action.payload.question] = action.payload?.user_answer_correct
            Object.keys(state.answers).map(k => {
                if (state.answers[k]) {
                    scoreCount++
                    noOfCorrectAnswers++
                }
            })
            state.score = scoreCount;
            state.noOfCorrectAnswers = noOfCorrectAnswers
            state.api.attemptQuestionLoading = false
        })
        builder.addCase(attemptQuestion.rejected, (state, action) => {
            state.api.attemptQuestionLoading = false
        })
    },
})

export const { resetScore, resetMissedAnswers, updateQuestion } = slice.actions
