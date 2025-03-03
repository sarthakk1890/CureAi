import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Doctor, LoginResponse, Patient, UserResponse } from '../../types/api-types';

export const userAPI = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/user/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Combined login/signup endpoint
        enter: builder.mutation<LoginResponse, {
            google_id: string;
            name: string;
            email: string;
            image?: string;
            role: 'doctor' | 'patient';
        }>({
            query: (userData) => ({
                url: 'enter',
                method: 'POST',
                body: userData,
            }),
        }),

        // Fetch user details using token in headers
        getUserDetails: builder.query<UserResponse, void>({
            query: () => ({
                url: 'me',
                method: 'GET',
            }),
        }),

        // Update doctor profile
        updateDoctorProfile: builder.mutation<{ success: boolean; data: Doctor }, any>({
            query: (profileData) => ({
                url: 'doctor/update',
                method: 'PUT',
                body: profileData,
            }),
        }),

        // Update patient profile
        updatePatientProfile: builder.mutation<{ success: boolean; data: Patient }, any>({
            query: (profileData) => ({
                url: 'patient/update',
                method: 'PUT',
                body: profileData,
            }),
        }),
    }),
});

export const {
    useEnterMutation,
    useGetUserDetailsQuery,
    useUpdateDoctorProfileMutation,
    useUpdatePatientProfileMutation,
} = userAPI;