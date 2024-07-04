import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "./api"

export const getTermsAndConditions = createAsyncThunk(
    "resources/getTermsAndConditions",
    async () => {
        const response = await api.getTermsAndConditions()
        return response.data
    }
)

const initialState = {
    termsAndCondition: {},
    api: { loading: false, error: null }
}

export const slice = createSlice({
    name: "termsAndCondition",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getTermsAndConditions.pending, (state, action) => {
            state.api.loading = true;
        })
        builder.addCase(getTermsAndConditions.fulfilled, (state, action) => {
            state.api.loading = false;
            state.termsAndCondition = action.payload
        })
        builder.addCase(getTermsAndConditions.rejected, (state, action) => {
            state.api.loading = false;
        })
    },
})
