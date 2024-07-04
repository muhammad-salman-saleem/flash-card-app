import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "./api"

export const getPrivacyPolicy = createAsyncThunk(
    "resources/getPrivacyPolicy",
    async () => {
        const response = await api.getPrivacyPolicy()
        return response.data
    }
)

const initialState = {
    privacyPolicy: {},
    api: { loading: false, error: null }
}

export const slice = createSlice({
    name: "privacyPolicy",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getPrivacyPolicy.pending, (state, action) => {
            state.api.loading = true;
        })
        builder.addCase(getPrivacyPolicy.fulfilled, (state, action) => {
            state.api.loading = false;
            state.privacyPolicy = action.payload
        })
        builder.addCase(getPrivacyPolicy.rejected, (state, action) => {
            state.api.loading = false;
        })
    },
})
