import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "./api"

export const getCategories = createAsyncThunk(
    "category/getCategories",
    async () => {
        const response = await api.getCategories()
        return response.data
    }
)

const initialState = {
    category: {},
    categories: [],
    api: { loading: false, error: null }
}

export const slice = createSlice({
    name: "category",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCategories.pending, (state, action) => {
            state.api.loading = true;
        })
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.api.loading = false;
            state.categories = action.payload
        })
        builder.addCase(getCategories.rejected, (state, action) => {
            state.api.loading = false;
        })
    },
})
