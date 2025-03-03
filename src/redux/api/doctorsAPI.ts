import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const doctorApi = createApi({
    reducerPath: 'doctorApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://cureback-ts.onrender.com/api/doctor' }), // Adjust base URL as needed
    endpoints: (builder) => ({
        getAllDoctors: builder.query({
            query: () => '/all',
        }),
        getDoctorById: builder.query({
            query: (doctorId) => `/details/${doctorId}`,
        }),
        getUnavailableSlots: builder.query({
            query: (doctorId) => `/unavailable-slots/${doctorId}`,
        }),
    }),
});

export const { useGetAllDoctorsQuery, useGetDoctorByIdQuery, useGetUnavailableSlotsQuery } = doctorApi;
