import { configureStore, createReducer, combineReducers } from "@reduxjs/toolkit";
import { slice as categorySlice } from '@modules/main/home/store'
import { slice as deckSlice } from '@modules/main/subject/store'
import { slice as questionSlice } from '@modules/main/question/store'
import { slice as authSlice } from '@modules/social-login/auth'
import { slice as faqSlice } from '@modules/main/faq/store'
import { slice as resourceSlice } from '@modules/main/resources/store'
import { slice as privacyPolicySlice } from '@modules/main/privacyPolicy/store'
import { slice as termsAndConditionsSlice } from '@modules/main/termsAndConditions/store'
import { slice as paymentsSlice } from '@modules/main/upgrade/store'

export const getStore = () => {

    const appState = {
        name: "late_limit_27923Identifier",
        url: "https://late_limit_27923Identifier.botics.co",
        version: "1.0.0"
    }

    const appReducer = createReducer(appState, _ => {
        return appState;
    })

    const reducer = combineReducers({
        app: appReducer,
        [categorySlice.name]: categorySlice.reducer,
        [deckSlice.name]: deckSlice.reducer,
        [questionSlice.name]: questionSlice.reducer,
        [authSlice.name]: authSlice.reducer,
        [faqSlice.name]: faqSlice.reducer,
        [resourceSlice.name]: resourceSlice.reducer,
        [privacyPolicySlice.name]: privacyPolicySlice.reducer,
        [termsAndConditionsSlice.name]: termsAndConditionsSlice.reducer,
        [paymentsSlice.name]: paymentsSlice.reducer
    });

    return configureStore({
        reducer: reducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    });
}
