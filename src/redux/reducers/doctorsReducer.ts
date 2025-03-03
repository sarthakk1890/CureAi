import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doctorApi } from '../api/doctorsAPI';


// TypeScript interfaces based on your Mongoose schema
export enum ROLES {
    DOCTOR = 'doctor',
    PATIENT = 'patient',
    ADMIN = 'admin'
}

export enum WEEKDAYS {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday'
}

export enum BREAK_TYPE {
    LUNCH = 'lunch',
    MEETING = 'meeting',
    PERSONAL = 'personal'
}

export interface WorkingHour {
    day: WEEKDAYS;
    start_time: string;
    end_time: string;
}

export interface RecurringBreak {
    break_type: BREAK_TYPE;
    days: WEEKDAYS[];
    start_time: string;
    end_time: string;
}

export interface BlockedSlot {
    start_time: string;
    end_time: string;
    reason?: string;
}

export interface Doctor {
    _id?: string;
    google_id?: string;
    name: string;
    email: string;
    role: ROLES;
    image: string;
    expertise: string[];
    institute?: string;
    title?: string;
    about?: string;
    experience?: number;
    phone?: string;
    cost_per_meeting?: number;
    meet_len_mins?: number;
    google_calendar_id?: string;
    slot_duration?: number;
    buffer_time?: number;
    unavailable_dates: string[]; // Dates as ISO strings
    unavailable_days: WEEKDAYS[];
    cartId?: string;
    working_hours: WorkingHour[];
    recurring_breaks: RecurringBreak[];
    blocked_slots: BlockedSlot[];
    createdAt?: string;
    updatedAt?: string;
}

// Define the state shape
interface DoctorState {
    selectedDoctor: Doctor | null;
    filteredDoctors: Doctor[];
    filterCriteria: {
        expertise?: string[];
        experience?: number;
        costRange?: { min: number; max: number };
        availability?: WEEKDAYS[];
    };
    loading: boolean;
    error: string | null;
}

const initialState: DoctorState = {
    selectedDoctor: null,
    filteredDoctors: [],
    filterCriteria: {},
    loading: false,
    error: null
};

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        setSelectedDoctor: (state, action: PayloadAction<Doctor>) => {
            state.selectedDoctor = action.payload;
        },
        clearSelectedDoctor: (state) => {
            state.selectedDoctor = null;
        },
        setFilterCriteria: (state, action: PayloadAction<Partial<DoctorState['filterCriteria']>>) => {
            state.filterCriteria = { ...state.filterCriteria, ...action.payload };
        },
        clearFilterCriteria: (state) => {
            state.filterCriteria = {};
        },
        filterDoctors: (state, action: PayloadAction<Doctor[]>) => {
            const { expertise, experience, costRange, availability } = state.filterCriteria;

            state.filteredDoctors = action.payload.filter(doctor => {
                // Filter by expertise if provided
                if (expertise && expertise.length > 0) {
                    if (!doctor.expertise.some(exp => expertise.includes(exp))) {
                        return false;
                    }
                }

                // Filter by experience if provided
                if (experience && doctor.experience) {
                    if (doctor.experience < experience) {
                        return false;
                    }
                }

                // Filter by cost range if provided
                if (costRange && doctor.cost_per_meeting) {
                    if (doctor.cost_per_meeting < costRange.min || doctor.cost_per_meeting > costRange.max) {
                        return false;
                    }
                }

                // Filter by availability if provided
                if (availability && availability.length > 0) {
                    // Check if the doctor works on any of the requested days
                    const doctorAvailableDays = doctor.working_hours.map(wh => wh.day);
                    if (!availability.some(day => doctorAvailableDays.includes(day))) {
                        return false;
                    }
                }

                return true;
            });
        }
    },
    extraReducers: (builder) => {
        // Handle loading states for all doctor-related queries
        builder.addMatcher(
            doctorApi.endpoints.getAllDoctors.matchPending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            doctorApi.endpoints.getAllDoctors.matchFulfilled,
            (state, action: PayloadAction<Doctor[]>) => {
                const { payload } = action;
                state.loading = false;
                // Automatically apply filters to the fetched doctors
                const doctors = payload as Doctor[];
                if (Object.keys(state.filterCriteria).length > 0) {
                    doctorSlice.caseReducers.filterDoctors(state, {
                        type: 'doctor/filterDoctors',
                        payload: doctors
                    });
                } else {
                    state.filteredDoctors = doctors;
                }
            }
        );
        builder.addMatcher(
            doctorApi.endpoints.getAllDoctors.matchRejected,
            (state, _) => {
                state.loading = false;
                state.error = 'Failed to fetch doctors';
            }
        );

        // Handle single doctor fetch
        builder.addMatcher(
            doctorApi.endpoints.getDoctorById.matchFulfilled,
            (state, action: PayloadAction<Doctor>) => {
                state.selectedDoctor = action.payload;
            }
        );
    }
});

export const {
    setSelectedDoctor,
    clearSelectedDoctor,
    setFilterCriteria,
    clearFilterCriteria,
    filterDoctors
} = doctorSlice.actions;

export default doctorSlice.reducer;