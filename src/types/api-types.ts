export interface LoginResponse {
    success: boolean;
    token: string;
    user: {
        _id: string;
        name: string;
        email: string;
        role: 'doctor' | 'patient';
        image?: string;
    };
}

export interface Doctor {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: 'doctor';
    image: string;
    expertise: string[];
    institute: string;
    title: string;
    about: string;
    experience: number;
    phone?: string;
    cost_per_meeting: number;
    meet_len_mins: number;
    google_calendar_id?: string;

    // Consultation configuration
    slot_duration: number;
    buffer_time: number;

    // Working hours configuration
    working_hours: {
        day: string;
        start_time: string;
        end_time: string;
    }[];

    off_days: string[]; // Regular weekly off days (WEEKDAYS enum values)

    // Break times and unavailable slots
    recurring_breaks: {
        break_type: string;
        days: string[];
        start_time: string;
        end_time: string;
    }[];

    blocked_slots: {
        start_time: string;
        end_time: string;
        reason?: string;
    }[];

    // Availability
    available_time_range: { start: string; end: string };
    unavailable_slots: { date: string; time: string }[];
    unavailable_dates: string[];
    break_slots: { start: string; end: string }[];
    unavailable_days: string[]; // WEEKDAYS enum values
}

export interface Patient {
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

export interface UserResponse {
    success: boolean;
    user: Patient | Doctor;
}

export interface AppointmentResponse {
    success: boolean;
    appointment: {
        _id: string;
        date: string;
        time_slot: string;
        doctor: {
            _id: string;
            name: string;
            expertise: string[];
            phone?: string;
        };
        patient: {
            _id: string;
            name: string;
            phone?: string;
        };
        patient_details: {
            age: number;
            gender: string;
            symptoms: string[];
        };
    };
}

export interface AppointmentsListResponse {
    success: boolean;
    appointments: Array<{
        _id: string;
        date: string;
        time_slot: string;
        doctor: {
            _id: string;
            name: string;
            expertise: string[];
        };
        patient: {
            _id: string;
            name: string;
        };
    }>;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface NewAppointmentRequest {
    doctorId: string;
    patientId: string;
    date: string;
    time_slot: string;
    patientDetails: {
        age: number;
        gender: string;
        symptoms: string[];
    };
}

export interface Appointment {
    _id: string;
    date: string;
    time_slot: string;
    doctor: {
        _id: string;
        name: string;
        expertise: string[];
    };
    patient: {
        _id: string;
        name: string;
    };
    patient_details: {
        age: number;
        gender: string;
        symptoms: string[];
    };
}

export interface AppointmentState {
    appointments: Appointment[];
    selectedAppointment: Appointment | null;
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
