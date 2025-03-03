import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";

import {
    FaSave,
    FaClock,
    FaCoffee,
    FaCalendar,
    FaPlus,
    FaTrash
} from "react-icons/fa";
import { useUpdateDoctorProfileMutation } from "../../../redux/api/userAPI";
import { setUser } from "../../../redux/reducers/userReducer";
import toast from "react-hot-toast";

// Define proper TypeScript interfaces
interface WorkingHours {
    _id?: string;
    day: string;
    start_time: string;
    end_time: string;
}

interface RecurringBreak {
    _id?: string;
    break_type: string;
    days: string[];
    start_time: string;
    end_time: string;
}

interface BlockedSlot {
    _id?: string;
    start_time: string;
    end_time: string;
    reason?: string;
}

interface AvailabilityData {
    unavailable_days: string[];
    unavailable_dates: string[];
    working_hours: WorkingHours[];
    recurring_breaks: RecurringBreak[];
    blocked_slots: BlockedSlot[];
    buffer_time: number;
    slot_duration: number;
    [key: string]: any; // Allow for additional properties from user object
}

const AvailabilityPage = () => {
    const user = useSelector((state: any) => state.user.user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const breakTypes = ["lunch", "tea", "meeting", "personal"];

    const dispatch = useDispatch();
    const [updateDoctorProfile] = useUpdateDoctorProfileMutation();

    // Initialize with explicit type and default values
    const [availability, setAvailability] = useState<AvailabilityData>({
        unavailable_days: [],
        unavailable_dates: [],
        working_hours: [],
        recurring_breaks: [],
        blocked_slots: [],
        buffer_time: 0,
        slot_duration: 30
    });

    // Helper function to format ISO date string to time string (HH:MM)
    const formatISOToTimeString = (isoString: string) => {
        if (!isoString) return "00:00";
        try {
            // Handle both ISO strings and regular time strings
            if (isoString.includes('T') || isoString.includes('Z')) {
                const date = new Date(isoString);
                return date.toTimeString().slice(0, 5);
            } else if (isoString.includes(':')) {
                return isoString;
            }
            return "00:00";
        } catch (err) {
            console.error("Error parsing time:", err);
            return "00:00";
        }
    };

    useEffect(() => {
        if (user) {
            setError("")
            try {
                const formattedUser: AvailabilityData = {
                    ...availability, // Keep default values
                    ...user, // Override with user data if available
                    // Ensure these are proper arrays with correct formats
                    unavailable_days: Array.isArray(user.unavailable_days) ? user.unavailable_days : [],
                    unavailable_dates: Array.isArray(user.unavailable_dates)
                        ? user.unavailable_dates.map((date: string | Date) =>
                            typeof date === 'string' ? new Date(date).toISOString() : new Date(date).toISOString()
                        )
                        : [],
                    working_hours: Array.isArray(user.working_hours)
                        ? user.working_hours.map((hours: any) => ({
                            ...hours,
                            start_time: hours.start_time ? formatISOToTimeString(hours.start_time) : "09:00",
                            end_time: hours.end_time ? formatISOToTimeString(hours.end_time) : "17:00",
                        }))
                        : [],
                    recurring_breaks: Array.isArray(user.recurring_breaks)
                        ? user.recurring_breaks.map((breakItem: any) => ({
                            ...breakItem,
                            days: Array.isArray(breakItem.days) ? breakItem.days : [],
                            start_time: breakItem.start_time ? formatISOToTimeString(breakItem.start_time) : "13:00",
                            end_time: breakItem.end_time ? formatISOToTimeString(breakItem.end_time) : "14:00",
                        }))
                        : [],
                    blocked_slots: Array.isArray(user.blocked_slots)
                        ? user.blocked_slots.map((slot: any) => ({
                            ...slot,
                            start_time: slot.start_time ?
                                (typeof slot.start_time === 'string' ?
                                    slot.start_time.slice(0, 16) :
                                    new Date(slot.start_time).toISOString().slice(0, 16)
                                ) : new Date().toISOString().slice(0, 16),
                            end_time: slot.end_time ?
                                (typeof slot.end_time === 'string' ?
                                    slot.end_time.slice(0, 16) :
                                    new Date(slot.end_time).toISOString().slice(0, 16)
                                ) : new Date().toISOString().slice(0, 16),
                        }))
                        : [],
                    buffer_time: typeof user.buffer_time === 'number' ? user.buffer_time : 0,
                    slot_duration: typeof user.slot_duration === 'number' ? user.slot_duration : 30
                };

                setAvailability(formattedUser);
                setLoading(false);
            } catch (err) {
                console.error("Error formatting user data:", err);
                setError("Error formatting user data. Please refresh the page.");
                setLoading(false);
            }
        } else {
            setError("User data not found");
            setLoading(false);
        }
    }, [user]);

    const toggleUnavailableDay = (day: string) => {
        setAvailability(prev => {
            if (prev.unavailable_days.includes(day)) {
                // If day was unavailable, make it available and add default working hours
                return {
                    ...prev,
                    unavailable_days: prev.unavailable_days.filter(d => d !== day),
                    working_hours: [...prev.working_hours, {
                        day,
                        start_time: "09:00",
                        end_time: "17:00",
                        _id: Date.now().toString() // Temporary ID for new entries
                    }]
                };
            } else {
                // If day was available, make it unavailable and remove any working hours
                return {
                    ...prev,
                    unavailable_days: [...prev.unavailable_days, day],
                    working_hours: prev.working_hours.filter(hours => hours.day !== day)
                };
            }
        });
    };

    const updateWorkingHours = (index: number, field: string, value: string) => {
        setAvailability(prev => {
            const updatedHours = [...prev.working_hours];
            updatedHours[index] = {
                ...updatedHours[index],
                [field]: value
            };
            return {
                ...prev,
                working_hours: updatedHours
            };
        });
    };

    const addWorkingHours = (day: string) => {
        setAvailability(prev => ({
            ...prev,
            working_hours: [
                ...prev.working_hours,
                {
                    day,
                    start_time: "09:00",
                    end_time: "17:00",
                    _id: Date.now().toString() // Temporary ID for new entries
                }
            ]
        }));
    };

    const addRecurringBreak = () => {
        setAvailability(prev => ({
            ...prev,
            recurring_breaks: [
                ...prev.recurring_breaks,
                {
                    break_type: "lunch",
                    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
                    start_time: "13:00",
                    end_time: "14:00",
                    _id: Date.now().toString() // Temporary ID for new entries
                }
            ]
        }));
    };

    const addBlockedSlot = () => {
        // Create a date for tomorrow at 9am
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);

        // Create an end time 1 hour later
        const endTime = new Date(tomorrow);
        endTime.setHours(10, 0, 0, 0);

        setAvailability(prev => ({
            ...prev,
            blocked_slots: [
                ...prev.blocked_slots,
                {
                    start_time: tomorrow.toISOString().slice(0, 16),
                    end_time: endTime.toISOString().slice(0, 16),
                    reason: "Personal appointment",
                    _id: Date.now().toString() // Temporary ID for new entries
                }
            ]
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage("");

            // Format the data back to proper format for API
            const formattedData = {
                ...availability,
                working_hours: availability.working_hours.map(hours => {
                    // Keep the original _id if it exists
                    const formattedHours: any = {
                        day: hours.day,
                        // Convert time strings to ISO date strings
                        start_time: formatTimeToISO(hours.start_time),
                        end_time: formatTimeToISO(hours.end_time)
                    };

                    if (hours._id) {
                        formattedHours._id = hours._id;
                    }

                    return formattedHours;
                }),
                recurring_breaks: availability.recurring_breaks.map(breakItem => {
                    const formattedBreak: any = {
                        break_type: breakItem.break_type,
                        days: breakItem.days,
                        start_time: formatTimeToISO(breakItem.start_time),
                        end_time: formatTimeToISO(breakItem.end_time)
                    };

                    if (breakItem._id) {
                        formattedBreak._id = breakItem._id;
                    }

                    return formattedBreak;
                }),
                // In the handleSubmit function, replace the blocked_slots formatting with this:
                blocked_slots: availability.blocked_slots.map(slot => {
                    // Parse the datetime-local string to get the exact time components
                    const [datePart, timePart] = slot.start_time.split('T');
                    const [startYear, startMonth, startDay] = datePart.split('-').map(Number);
                    const [startHour, startMinute] = timePart.split(':').map(Number);

                    const [endDatePart, endTimePart] = slot.end_time.split('T');
                    const [endYear, endMonth, endDay] = endDatePart.split('-').map(Number);
                    const [endHour, endMinute] = endTimePart.split(':').map(Number);

                    // Create Date objects with the UTC time that matches the local time the user selected
                    const startDate = new Date(Date.UTC(startYear, startMonth - 1, startDay, startHour, startMinute));
                    const endDate = new Date(Date.UTC(endYear, endMonth - 1, endDay, endHour, endMinute));

                    const formattedSlot: any = {
                        start_time: startDate.toISOString(),
                        end_time: endDate.toISOString(),
                        reason: slot.reason
                    };

                    if (slot._id) {
                        formattedSlot._id = slot._id;
                    }

                    return formattedSlot;
                })
            };

            const formattedData2 = { ...formattedData, name: user.name, email: user.email, image: user.image }

            toast.promise(
                updateDoctorProfile(formattedData2).unwrap().then((response) => {
                    dispatch(setUser(response.data));
                    setLoading(false);
                    return response; // Ensure the success toast gets triggered
                }),
                {
                    loading: "Updating availability...",
                    success: "Availability updated successfully!",
                    error: "Failed to update availability. Please try again."
                }
            );

        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || "Failed to update availability settings");
        }
    };

    // Helper function to format time string to ISO date string
    const formatTimeToISO = (timeString: string) => {
        const now = new Date();
        const [hours, minutes] = timeString.split(':');
        now.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        return now.toISOString();
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
                <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-text-light">Loading your availability settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-dark">Doctor Availability Settings</h1>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex items-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-semidark'} text-white px-4 py-2 rounded transition-colors`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <FaSave className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            {/* Working Hours Section */}
            <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-4">
                    <FaClock className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-text-dark">Working Hours</h2>
                </div>
                <div className="space-y-4">
                    {weekdays.map(day => (
                        <div key={day} className="flex items-center gap-4 flex-wrap">
                            <div className="w-32 font-medium text-text-dark capitalize">{day}</div>
                            <button
                                className={`px-4 py-2 rounded ${availability.unavailable_days.includes(day)
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-primary-light text-primary-dark'
                                    }`}
                                onClick={() => toggleUnavailableDay(day)}
                            >
                                {availability.unavailable_days.includes(day) ? 'Unavailable' : 'Available'}
                            </button>
                            {!availability.unavailable_days.includes(day) && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    {availability.working_hours
                                        .filter(hours => hours.day === day)
                                        .map((hours, hourIndex) => (
                                            <div key={hours._id || hourIndex} className="flex items-center gap-2">
                                                <input
                                                    type="time"
                                                    value={hours.start_time}
                                                    onChange={(e) => updateWorkingHours(
                                                        availability.working_hours.findIndex(h => h === hours),
                                                        'start_time',
                                                        e.target.value
                                                    )}
                                                    className="border rounded p-1"
                                                />
                                                <span className="text-text-dark">to</span>
                                                <input
                                                    type="time"
                                                    value={hours.end_time}
                                                    onChange={(e) => updateWorkingHours(
                                                        availability.working_hours.findIndex(h => h === hours),
                                                        'end_time',
                                                        e.target.value
                                                    )}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setAvailability(prev => ({
                                                            ...prev,
                                                            working_hours: prev.working_hours.filter(h => h !== hours)
                                                        }));
                                                    }}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    <button
                                        onClick={() => addWorkingHours(day)}
                                        className="flex items-center gap-1 text-primary-semidark hover:text-primary-dark"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        Add Hours
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Recurring Breaks Section */}
            <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-4">
                    <FaCoffee className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-text-dark">Recurring Breaks</h2>
                </div>
                <div className="space-y-4">
                    {availability.recurring_breaks.map((break_, index) => (
                        <div key={break_._id || index} className="flex items-center gap-4 flex-wrap">
                            <select
                                value={break_.break_type}
                                onChange={(e) => {
                                    const newBreaks = [...availability.recurring_breaks];
                                    newBreaks[index] = { ...break_, break_type: e.target.value };
                                    setAvailability(prev => ({ ...prev, recurring_breaks: newBreaks }));
                                }}
                                className="border rounded p-2"
                            >
                                {breakTypes.map(type => (
                                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                ))}
                            </select>
                            <input
                                type="time"
                                value={break_.start_time}
                                onChange={(e) => {
                                    const newBreaks = [...availability.recurring_breaks];
                                    newBreaks[index] = { ...break_, start_time: e.target.value };
                                    setAvailability(prev => ({ ...prev, recurring_breaks: newBreaks }));
                                }}
                                className="border rounded p-1"
                            />
                            <span className="text-text-dark">to</span>
                            <input
                                type="time"
                                value={break_.end_time}
                                onChange={(e) => {
                                    const newBreaks = [...availability.recurring_breaks];
                                    newBreaks[index] = { ...break_, end_time: e.target.value };
                                    setAvailability(prev => ({ ...prev, recurring_breaks: newBreaks }));
                                }}
                                className="border rounded p-1"
                            />
                            <div className="flex flex-wrap gap-2 my-2">
                                {weekdays.map(day => (
                                    <label key={day} className="flex items-center gap-1">
                                        <input
                                            type="checkbox"
                                            checked={break_.days?.includes(day)}
                                            onChange={(e) => {
                                                const newBreaks = [...availability.recurring_breaks];
                                                if (e.target.checked) {
                                                    newBreaks[index] = {
                                                        ...break_,
                                                        days: [...(break_.days || []), day]
                                                    };
                                                } else {
                                                    newBreaks[index] = {
                                                        ...break_,
                                                        days: (break_.days || []).filter(d => d !== day)
                                                    };
                                                }
                                                setAvailability(prev => ({
                                                    ...prev,
                                                    recurring_breaks: newBreaks
                                                }));
                                            }}
                                            className="h-4 w-4"
                                        />
                                        <span className="text-sm">{day.slice(0, 3)}</span>
                                    </label>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setAvailability(prev => ({
                                        ...prev,
                                        recurring_breaks: prev.recurring_breaks.filter((_, i) => i !== index)
                                    }));
                                }}
                                className="text-red-500 hover:text-red-600"
                            >
                                <FaTrash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addRecurringBreak}
                        className="flex items-center gap-2 text-primary-semidark hover:text-primary-dark"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add Break
                    </button>
                </div>
            </div>

            {/* Blocked Slots Section */}
            <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-4">
                    <FaCalendar className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-text-dark">Blocked Slots</h2>
                </div>
                <div className="space-y-4">
                    {availability.blocked_slots.map((slot, index) => (
                        <div key={slot._id || index} className="flex items-center gap-4 flex-wrap">
                            <input
                                type="datetime-local"
                                value={slot.start_time}
                                onChange={(e) => {
                                    const newSlots = [...availability.blocked_slots];
                                    newSlots[index] = { ...slot, start_time: e.target.value };
                                    setAvailability(prev => ({ ...prev, blocked_slots: newSlots }));
                                }}
                                className="border rounded p-1"
                            />
                            <span className="text-text-dark">to</span>
                            <input
                                type="datetime-local"
                                value={slot.end_time}
                                onChange={(e) => {
                                    const newSlots = [...availability.blocked_slots];
                                    newSlots[index] = { ...slot, end_time: e.target.value };
                                    setAvailability(prev => ({ ...prev, blocked_slots: newSlots }));
                                }}
                                className="border rounded p-1"
                            />
                            <input
                                type="text"
                                placeholder="Reason"
                                value={slot.reason || ''}
                                onChange={(e) => {
                                    const newSlots = [...availability.blocked_slots];
                                    newSlots[index] = { ...slot, reason: e.target.value };
                                    setAvailability(prev => ({ ...prev, blocked_slots: newSlots }));
                                }}
                                className="border rounded p-1 flex-1 min-w-[200px]"
                            />
                            <button
                                onClick={() => {
                                    setAvailability(prev => ({
                                        ...prev,
                                        blocked_slots: prev.blocked_slots.filter((_, i) => i !== index)
                                    }));
                                }}
                                className="text-red-500 hover:text-red-600"
                            >
                                <FaTrash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addBlockedSlot}
                        className="flex items-center gap-2 text-primary-semidark hover:text-primary-dark"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add Blocked Slot
                    </button>
                </div>
            </div>

            {/* Slot Duration and Buffer Time Section */}
            <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-4">
                    <FaClock className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-text-dark">Appointment Settings</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Slot Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="5"
                            value={availability.slot_duration || 0}
                            onChange={(e) => setAvailability(prev => ({
                                ...prev,
                                slot_duration: parseInt(e.target.value) || 0
                            }))}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Buffer Time (minutes)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="5"
                            value={availability.buffer_time || 0}
                            onChange={(e) => setAvailability(prev => ({
                                ...prev,
                                buffer_time: parseInt(e.target.value) || 0
                            }))}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityPage;