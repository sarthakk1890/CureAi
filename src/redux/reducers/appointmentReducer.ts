import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, AppointmentState } from '../../types/api-types';

const initialState: AppointmentState = {
    appointments: [],
    selectedAppointment: null,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },
};

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        setAppointments: (state, action: PayloadAction<{ appointments: Appointment[]; pagination: AppointmentState['pagination'] }>) => {
            state.appointments = action.payload.appointments;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
            state.selectedAppointment = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearAppointments: (state) => {
            state.appointments = [];
            state.selectedAppointment = null;
            state.loading = false;
            state.error = null;
            state.pagination = initialState.pagination;
        },
    },
});

export const {
    setAppointments,
    setSelectedAppointment,
    setLoading,
    setError,
    clearAppointments,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;