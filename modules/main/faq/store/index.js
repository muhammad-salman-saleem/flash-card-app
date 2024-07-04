import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "./api"

export const getFaqs = createAsyncThunk(
    "deck/getFAQs",
    async () => {
        const response = await api.getFAQs()
        return response.data
    }
)

const initialState = {
    faqs: [],
    api: { loading: false, error: null }
}

export const slice = createSlice({
    name: "faq",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFaqs.pending, (state, action) => {
            state.api.loading = true;
        })
        builder.addCase(getFaqs.fulfilled, (state, action) => {
            state.api.loading = false;
            state.faqs = action.payload
        })
        builder.addCase(getFaqs.rejected, (state, action) => {
            state.api.loading = false;
        })
    },
})
