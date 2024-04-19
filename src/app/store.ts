import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import authApi, { authApiReducer } from '../api/share/Auth';
import areaApi, { areaApiReducer } from '../api/share/area';
import specialtyApi, { specialtyApiReducer } from '../api/admin/Specialty';
import clinicsApi, { clinicsApiReducer } from '../api/site/Clinics';
import uploadApi, { uploadApiReducer } from '../api/share/upload';
import accountApi, { accountApiReducer } from '../api/admin/Account';
import doctorApi, { doctorApiReducer } from '../api/admin/Doctor';
import bookingApi, { bookingApiReducer } from '../api/admin/Booking';
import profileApi, { profileApiReducer } from '../api/site/Profile';
import serviceApi, { serviceApiReducer } from '../api/admin/Service';
import paymentApi, { paymentApiReducer } from '../api/site/Payment';

// Định nghĩa kiểu cho RootState
export interface RootState {
    [authApi.reducerPath]: ReturnType<typeof authApiReducer>;
    [areaApi.reducerPath]: ReturnType<typeof areaApiReducer>;
    [specialtyApi.reducerPath]: ReturnType<typeof specialtyApiReducer>;
    [clinicsApi.reducerPath]: ReturnType<typeof clinicsApiReducer>;
    [uploadApi.reducerPath]: ReturnType<typeof uploadApiReducer>;
    [accountApi.reducerPath]: ReturnType<typeof accountApiReducer>;
    [doctorApi.reducerPath]: ReturnType<typeof doctorApiReducer>;
    [bookingApi.reducerPath]: ReturnType<typeof bookingApiReducer>;
    [profileApi.reducerPath]: ReturnType<typeof profileApiReducer>;
    [serviceApi.reducerPath]: ReturnType<typeof serviceApiReducer>;
    [paymentApi.reducerPath]: ReturnType<typeof paymentApiReducer>;
}

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', "auth"]
}

const rootReducer = combineReducers<RootState>({
    [authApi.reducerPath]: authApiReducer,
    [areaApi.reducerPath]: areaApiReducer,
    [specialtyApi.reducerPath]: specialtyApiReducer,
    [clinicsApi.reducerPath]: clinicsApiReducer,
    [uploadApi.reducerPath]: uploadApiReducer,
    [accountApi.reducerPath]: accountApiReducer,
    [doctorApi.reducerPath]: doctorApiReducer,
    [bookingApi.reducerPath]: bookingApiReducer,
    [profileApi.reducerPath]: profileApiReducer,
    [serviceApi.reducerPath]: serviceApiReducer,
    [paymentApi.reducerPath]: paymentApiReducer,
})

const middleware = [
    authApi.middleware,
    areaApi.middleware,
    specialtyApi.middleware,
    clinicsApi.middleware,
    uploadApi.middleware,
    accountApi.middleware,
    doctorApi.middleware,
    bookingApi.middleware,
    profileApi.middleware,
    serviceApi.middleware,
    paymentApi.middleware,
]

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(...middleware),
})

export type AppDispatch = typeof store.dispatch

export default persistStore(store);
