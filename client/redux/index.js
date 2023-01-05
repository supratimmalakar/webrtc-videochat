import { configureStore } from '@reduxjs/toolkit'
import toastReducer from './toastReducer'
import peerReducer from './peerReducer'
import authReducer from './authReducer'

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        peer: peerReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})