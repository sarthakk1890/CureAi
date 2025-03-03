import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AppointmentResponse, AppointmentsListResponse, NewAppointmentRequest } from '../../types/api-types';

export const appointmentAPI = createApi({
    reducerPath: 'appointmentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/appointment/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Appointment'],
    endpoints: (builder) => ({
        // Create new appointment
        newAppointment: builder.mutation<AppointmentResponse, NewAppointmentRequest>({
            query: (appointmentData) => ({
                url: 'new',
                method: 'POST',
                body: appointmentData,
            }),
            invalidatesTags: ['Appointment'],
        }),

        // Get all appointments with pagination
        getAllAppointments: builder.query<AppointmentsListResponse, { page?: number; limit?: number }>({
            query: (queryParams) => ({
                url: 'all',
                method: 'GET',
                params: {
                    page: queryParams.page,
                    limit: queryParams.limit
                }
            }),
            providesTags: ['Appointment'],
        }),

        // Get single appointment
        getSingleAppointment: builder.query<AppointmentResponse, string>({
            query: (id) => ({
                url: `${id}`,
                method: 'GET',
            }),
            providesTags: ['Appointment'],
        }),

        // Update appointment
        updateAppointment: builder.mutation<AppointmentResponse, { id: string; data: Partial<NewAppointmentRequest> }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Appointment'],
        }),

        // Delete appointment
        deleteAppointment: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Appointment'],
        }),
    }),
});

export const {
    useNewAppointmentMutation,
    useGetAllAppointmentsQuery,
    useGetSingleAppointmentQuery,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
} = appointmentAPI;