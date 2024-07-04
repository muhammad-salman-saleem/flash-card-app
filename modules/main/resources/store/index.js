import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "./api"

export const getResources = createAsyncThunk(
    "resources/getResources",
    async () => {
        const response = await api.getResources()
        return response.data
    }
)

const initialState = {
    resource: {},
    resources: [],
    api: { loading: false, error: null }
}

export const slice = createSlice({
    name: "resource",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getResources.pending, (state, action) => {
            state.api.loading = true;
        })
        builder.addCase(getResources.fulfilled, (state, action) => {
            state.api.loading = false;
            state.resources = action.payload
        })
        builder.addCase(getResources.rejected, (state, action) => {
            state.api.loading = false;
        })
    },
})
