import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "./api"

export const getDecks = createAsyncThunk(
    "deck/getDecks",
    async (category_id) => {
        const response = await api.getDecks(category_id)
        return response.data
    }
)


const initialState = {
    deck: {},
    decks: [],
    api: { loading: false, error: null }
}

export const slice = createSlice({
    name: "deck",
    initialState: initialState,
    reducers: {
        updateDeck: (state, action) => {

            const {deck, answered_correct, answered_percentage} = action.payload
            state.decks = state.decks.map(item => {
                if (item.id === deck) {
                    item.answered_correct = answered_correct;
                    item.answered_percentage = answered_percentage;
                }

                return item
            })

        }
    },
    extraReducers: (builder) => {
        builder.addCase(getDecks.pending, (state, action) => {
            state.api.loading = true;
        })
        builder.addCase(getDecks.fulfilled, (state, action) => {
            state.api.loading = false;
            state.decks = action.payload
        })
        builder.addCase(getDecks.rejected, (state, action) => {
            state.api.loading = false;
        })
    },
})

export const { updateDeck } = slice.actions
