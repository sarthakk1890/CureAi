import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define User Types for Doctor and Patient
interface Doctor {
    _id: string;
    google_id?: string; 
    name: string;
    email: string;
    role: 'doctor';
    image: string;
    expertise?: string[];
    institute?: string;
    title?: string;
    about?: string;
    experience?: number;
    phone?: string;
    cost_per_meeting?: number;
    meet_len_mins?: number;
    google_calendar_id?: string;
    cartId?: string;

    // Consultation configuration
    slot_duration?: number;
    buffer_time?: number;

    // Working hours configuration
    working_hours?: {
        day: string; // from WEEKDAYS enum
        start_time: string; // Date as string
        end_time: string;   // Date as string
    }[];

    // Unavailable times
    unavailable_dates?: string[]; // Dates as strings
    unavailable_days?: string[]; // WEEKDAYS enum values

    // Break times and unavailable slots
    recurring_breaks?: {
        break_type: string; // from BREAK_TYPE enum
        days: string[];     // from WEEKDAYS enum
        start_time: string; // Date as string
        end_time: string;   // Date as string
    }[];

    blocked_slots?: {
        start_time: string; // Date as string
        end_time: string;   // Date as string
        reason?: string;
    }[];
    
    createdAt?: string;
    updatedAt?: string;
}

interface Patient {
    _id: string;
    name: string;
    email: string;
    role: 'patient';
    image: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    bloodGroup?: string;
    phone?: string;
}

// Union Type for User
type User = Doctor | Patient | null;

interface UserState {
    user: User;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState['user']>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
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
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('token');
        },
    },
});

export const { setUser, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer;
