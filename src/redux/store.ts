import { configureStore } from '@reduxjs/toolkit';
import { userAPI } from './api/userAPI';
import userReducer, { setUser, setError } from './reducers/userReducer';
import { doctorApi } from './api/doctorsAPI';
import doctorReducer from './reducers/doctorsReducer';

const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        user: userReducer,
        [doctorApi.reducerPath]: doctorApi.reducer,
        doctor: doctorReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userAPI.middleware, doctorApi.middleware),
});

const token = localStorage.getItem('token');

if (token) {
    store.dispatch(userAPI.endpoints.getUserDetails.initiate())
        .unwrap()
        .then((userData) => {
            store.dispatch(setUser(userData.user));
        })
        .catch((err) => {
            console.error('Error fetching user:', err);
            localStorage.removeItem('token'); // Remove token if invalid
            store.dispatch(setError('Failed to authenticate user'));
        });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
