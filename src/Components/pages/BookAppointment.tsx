import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaNotesMedical, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

interface Doctor {
    _id: string;
    name: string;
    image: string;
    expertise: string[];
    title: string;
    unavailable_dates: string[];
    unavailable_days: string[];
    working_hours: WorkingHour[];
    recurring_breaks: RecurringBreak[];
    blocked_slots: BlockedSlot[];
    buffer_time: number;
    meet_len_mins: number;
    slot_duration: number;
}

interface WorkingHour {
    day: string;
    start_time: string;
    end_time: string;
    _id: string;
}

interface RecurringBreak {
    break_type: string;
    days: string[];
    start_time: string;
    end_time: string;
    _id: string;
}

interface BlockedSlot {
    start_time: string;
    end_time: string;
    reason: string;
    _id: string;
}

interface TimeSlots {
    morning: string[];
    afternoon: string[];
}

interface Appointment {
    date: string;
    timeSlot: string;
    symptoms: string;
}

const BookAppointment: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [symptoms, setSymptoms] = useState<string>('');
    //@ts-ignore
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [timeSlots, setTimeSlots] = useState<TimeSlots>({ morning: [], afternoon: [] });
    const [bookedAppointments, setBookedAppointments] = useState<{ date: string, time_slot: string }[]>([]);

    //@ts-ignore
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Add this to get user data from Redux
    //@ts-ignore
    const user = useSelector((state) => state.user.user);
    //console.log(user)

    const { id: doctorId } = useParams<{ id: string }>();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDoctorDetails();
        fetchBookedAppointments();
    }, [doctorId]);

    const fetchBookedAppointments = async () => {
        try {
            // Replace with your actual API endpoint
            const response = await axios.get(`https://cureback-ts.onrender.com/api/doctor/unavailable-slots/${doctorId}`);
            setBookedAppointments(response.data.data || []);
        } catch (err) {
            //console.error("Failed to fetch booked appointments", err);
            // Default to empty array if fetch fails
            setBookedAppointments([]);
        }
    };

    const fetchDoctorDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://cureback-ts.onrender.com/api/doctor/details/${doctorId}`);
            //console.log(response.data.data);
            setDoctor(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch doctor details');
            toast.error('Failed to load doctor details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getDayName = (date: Date): string => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    };

    const isUnavailableDate = (date: Date): boolean => {
        if (!doctor) return true;

        const formattedDate = formatDate(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if date is in the past
        if (date < today) return true;

        // Check if date is in unavailable_dates
        const isUnavailable = doctor.unavailable_dates.some(d => {
            // Fix the date comparison - previous code might have had timezone issues
            const dateStr = new Date(d).toISOString().split('T')[0];
            return dateStr === formattedDate;
        });

        if (isUnavailable) return true;

        // Check if day is in unavailable_days
        const dayName = getDayName(date);
        if (doctor.unavailable_days.includes(dayName)) return true;

        // Check if day has working hours
        const hasWorkingHours = doctor.working_hours.some(wh => wh.day === dayName);

        return !hasWorkingHours;
    };

    const generateTimeSlots = (date: Date): TimeSlots => {
        if (!doctor) return { morning: [], afternoon: [] };

        const dayName = getDayName(date);
        const workingHour = doctor.working_hours.find(wh => wh.day === dayName);

        if (!workingHour) return { morning: [], afternoon: [] };

        const slots: string[] = [];
        const formattedDate = formatDate(date);
        const slotDurationMinutes = doctor.slot_duration || 30;
        const bufferTimeMinutes = doctor.buffer_time || 0;
        const meetingLengthMinutes = doctor.meet_len_mins || 30;
        const totalSlotMinutes = meetingLengthMinutes + bufferTimeMinutes;

        // Parse start and end times
        let startTime, endTime;

        if (workingHour.start_time.includes('T')) {
            // If it's in ISO format
            startTime = new Date(workingHour.start_time);
            endTime = new Date(workingHour.end_time);
        } else {
            // If it's just time string like "09:00"
            startTime = new Date(`${formattedDate}T${workingHour.start_time}`);
            endTime = new Date(`${formattedDate}T${workingHour.end_time}`);
        }

        // Set the correct date for start and end times
        const slotDate = new Date(date);
        startTime.setFullYear(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate());
        endTime.setFullYear(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate());

        //console.log('Working hours for', dayName, ':',
        // startTime.toLocaleTimeString(), 'to', endTime.toLocaleTimeString());

        // Generate slots
        const currentSlot = new Date(startTime);

        while (currentSlot.getTime() + totalSlotMinutes * 60000 <= endTime.getTime()) {
            // Format current slot time for comparison with booked appointments
            const hours = currentSlot.getHours();
            const minutes = currentSlot.getMinutes();
            // const formattedHours = hours < 10 ? `0${hours}` : hours;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const slotEndHours = new Date(currentSlot.getTime() + meetingLengthMinutes * 60000).getHours();
            const slotEndMinutes = new Date(currentSlot.getTime() + meetingLengthMinutes * 60000).getMinutes();
            // const formattedEndHours = slotEndHours < 10 ? `0${slotEndHours}` : slotEndHours;
            const formattedEndMinutes = slotEndMinutes < 10 ? `0${slotEndMinutes}` : slotEndMinutes;

            // Format as "10:00 AM - 10:30 AM" to match API format
            const slotAmPm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const endAmPm = slotEndHours >= 12 ? 'PM' : 'AM';
            const displayEndHours = slotEndHours % 12 || 12;

            const formattedTimeSlot = `${displayHours}:${formattedMinutes.toString().padStart(2, '0')} ${slotAmPm} - ${displayEndHours}:${formattedEndMinutes.toString().padStart(2, '0')} ${endAmPm}`;

            // Check if this slot is already booked
            const isSlotBooked = bookedAppointments.some(appointment =>
                appointment.date === formattedDate &&
                appointment.time_slot === formattedTimeSlot
            );

            // Check recurring breaks
            const isInRecurringBreak = doctor.recurring_breaks.some(breakItem => {
                if (!breakItem.days.includes(dayName)) return false;

                let breakStart, breakEnd;
                if (breakItem.start_time.includes('T')) {
                    breakStart = new Date(breakItem.start_time);
                    breakEnd = new Date(breakItem.end_time);
                } else {
                    breakStart = new Date(`${formattedDate}T${breakItem.start_time}`);
                    breakEnd = new Date(`${formattedDate}T${breakItem.end_time}`);
                }

                breakStart.setFullYear(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate());
                breakEnd.setFullYear(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate());

                const slotEnd = new Date(currentSlot.getTime() + meetingLengthMinutes * 60000);
                return (
                    (currentSlot >= breakStart && currentSlot < breakEnd) ||
                    (slotEnd > breakStart && slotEnd <= breakEnd) ||
                    (currentSlot <= breakStart && slotEnd >= breakEnd)
                );
            });

            // Check blocked slots
            const isInBlockedSlot = doctor.blocked_slots.some(blockedSlot => {
                let blockStart, blockEnd;

                // Parse the start and end times properly
                if (blockedSlot.start_time.includes('T')) {
                    blockStart = new Date(blockedSlot.start_time);
                    blockEnd = new Date(blockedSlot.end_time);

                    // Fix the midnight issue - if the end time shows midnight (00:00),
                    // and it's the same day as the start time, treat it as noon (12:00)
                    if (blockEnd.getHours() === 0 &&
                        blockEnd.getMinutes() === 0 &&
                        blockEnd.getDate() === blockStart.getDate()) {
                        blockEnd.setHours(12, 0, 0, 0);
                        //console.log('Fixed midnight to noon:', blockEnd.toISOString());
                    }
                } else {
                    blockStart = new Date(`${formattedDate}T${blockedSlot.start_time}`);
                    blockEnd = new Date(`${formattedDate}T${blockedSlot.end_time}`);
                }

                // Check if this blocked slot is for the selected date
                const blockStartDate = blockStart.toISOString().split('T')[0];
                if (blockStartDate !== formattedDate) {
                    return false;
                }

                // Calculate the end of the current slot
                const slotEnd = new Date(currentSlot.getTime() + meetingLengthMinutes * 60000);

                // Check if there's any overlap between the current slot and the blocked slot
                const isBlocked = (
                    (currentSlot >= blockStart && currentSlot < blockEnd) ||
                    (slotEnd > blockStart && slotEnd <= blockEnd) ||
                    (currentSlot <= blockStart && slotEnd >= blockEnd)
                );

                if (isBlocked) {
                    //console.log('Blocked slot detected:', {
                    //     currentTime: currentSlot.toLocaleTimeString(),
                    //     blockStart: blockStart.toLocaleTimeString(),
                    //     blockEnd: blockEnd.toLocaleTimeString()
                    // });
                }

                return isBlocked;
            });

            if (!isInRecurringBreak && !isInBlockedSlot && !isSlotBooked) {
                // Format for display in the UI
                const displayHours = currentSlot.getHours() % 12 || 12;
                const displayMinutes = currentSlot.getMinutes().toString().padStart(2, '0');
                const ampm = currentSlot.getHours() >= 12 ? 'PM' : 'AM';

                slots.push(`${displayHours}:${displayMinutes} ${ampm}`);
            }

            // Move to next slot
            currentSlot.setMinutes(currentSlot.getMinutes() + slotDurationMinutes);
        }

        // //console.log('Generated slots for date', formattedDate, slots);

        // Divide into morning and afternoon slots
        const morning: string[] = [];
        const afternoon: string[] = [];

        slots.forEach(slot => {
            const hourPart = slot.split(':')[0];
            const hour = parseInt(hourPart);
            const isPM = slot.includes('PM');

            if ((isPM && hour !== 12) || (hour === 12 && !slot.includes('AM'))) {
                afternoon.push(slot);
            } else {
                morning.push(slot);
            }
        });

        // //console.log('Morning slots:', morning);
        // //console.log('Afternoon slots:', afternoon);

        return { morning, afternoon };
    };

    const handleDateSelect = (date: Date) => {
        const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        setSelectedDate(newDate);
        setSelectedTime(null);

        // Generate time slots for the selected date
        const availableSlots = generateTimeSlots(newDate);
        setTimeSlots(availableSlots);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const daysInMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const startOfMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const randomKey = (): string => {
        return Math.random().toString(36).substr(2, 9);
    }

    const handleSubmit = async () => {
        if (selectedDate && selectedTime && symptoms) {
            try {
                setIsSubmitting(true);

                // Calculate end time for display in toast
                const endTimeForDisplay = calculateEndTime(selectedTime, doctor?.meet_len_mins || 30);

                // Format appointment data for API
                const appointmentData = {
                    doctorId,
                    date: formatDate(selectedDate),
                    time_slot: `${selectedTime} - ${endTimeForDisplay}`,
                    symptoms,
                    // User details from Redux store
                    name: user.name,
                    gender: user.gender,
                    age: user.age,
                    bloodgroup: user.bloodGroup,
                    // These fields can be generated by backend
                    meet_link: `https://meet.google.com/${randomKey()}-link`
                };

                // Submit appointment to backend
                const token = localStorage.getItem('token');
                // const response = await axios.post('http://localhost:3000/api/appointment/new', appointmentData, {
                //     headers: {
                //         Authorization: `Bearer ${token}`
                //     }
                // });

                const response = await toast.promise(
                    axios.post('https://cureback-ts.onrender.com/api/appointment/new', appointmentData, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    {
                        loading: 'Booking your appointment...',
                        success: 'Appointment booked successfully!',
                        error: 'Failed to book appointment. Please try again.'
                    }
                );

                if (response.status === 201) {
                    // Set the appointment for display
                    setAppointment({
                        date: formatDate(selectedDate),
                        timeSlot: appointmentData.time_slot,
                        symptoms,
                    });

                    // Show custom toast
                    toast.custom((t) => (
                        <div
                            className={`
                                ${t.visible ? 'animate-enter' : 'animate-leave'}
                                max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto 
                                border-l-4 border-primary ring-1 ring-black ring-opacity-5
                                transform transition-all duration-300 ease-in-out
                            `}
                        >
                            <div className="p-6">
                                <div className="flex items-start">
                                    <div className="flex-1 w-0">
                                        {/* Success Icon */}
                                        <div className="flex items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-6 w-6 text-primary"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-primary">
                                                    Appointment Details
                                                </p>
                                            </div>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold text-gray-600">Doctor:</span>
                                                <span className="ml-2 text-sm text-gray-700">{doctor?.name}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold text-gray-600">Date:</span>
                                                <span className="ml-2 text-sm text-gray-700">{appointmentData.date}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold text-gray-600">Time:</span>
                                                <span className="ml-2 text-sm text-gray-700">{appointmentData.time_slot}</span>
                                            </div>
                                            <div className="flex items-start">
                                                <span className="text-sm font-semibold text-gray-600">Symptoms:</span>
                                                <span className="ml-2 text-sm text-gray-700">{appointmentData.symptoms}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Close Button */}
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button
                                            onClick={() => {
                                                toast.dismiss(t.id);
                                                setSymptoms('');
                                                setSelectedDate(null);
                                                setSelectedTime(null);
                                            }}
                                            className="rounded-md inline-flex text-gray-400 hover:text-gray-500 
                                                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                        >
                                            <span className="sr-only">Close</span>
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ));

                    // Reset form
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setSymptoms('');

                    // Refresh booked appointments to update UI
                    fetchBookedAppointments();
                } else {
                    toast.error(response.data.message || 'Failed to book appointment');
                }

            } catch (err: any) {
                // //console.error("Error booking appointment:", err);
                // Display error message from backend if available
                toast.error(err.response?.data?.message || 'Failed to book appointment. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            toast.error('Please fill all the required fields');
        }
    };

    // Helper function to calculate the end time for the appointment
    const calculateEndTime = (startTime: string, durationMinutes: number): string => {
        // Parse the start time (e.g., "10:00 AM")
        const [timePart, ampm] = startTime.split(' ');
        const [hourStr, minuteStr] = timePart.split(':');

        let hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);

        // Adjust hour for 12-hour format
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;

        // Create a date object to handle time arithmetic
        const date = new Date();
        date.setHours(hour, minute, 0, 0);

        // Add duration
        date.setMinutes(date.getMinutes() + durationMinutes);

        // Format to 12-hour time
        let endHour = date.getHours();
        const endMinute = date.getMinutes();
        const endAmPm = endHour >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        endHour = endHour % 12 || 12;

        // Return formatted time
        return `${endHour}:${endMinute.toString().padStart(2, '0')} ${endAmPm}`;
    };

    const renderCalendar = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const totalDays = daysInMonth(currentDate);
        const startDay = startOfMonth(currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let calendarDays = [];
        for (let i = 0; i < startDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="h-12"></div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const formattedDate = formatDate(date);
            const isUnavailable = isUnavailableDate(date);
            const isSelected = selectedDate && formatDate(selectedDate) === formattedDate;
            const isPast = date < today;

            calendarDays.push(
                <button
                    key={day}
                    onClick={() => !isUnavailable && !isPast && handleDateSelect(date)}
                    disabled={isUnavailable || isPast}
                    className={`
                        relative h-12 rounded-lg flex items-center justify-center font-medium 
                        transition-all duration-200
                        ${isSelected ? 'bg-primary text-white scale-95' : ''}
                        ${!isUnavailable && !isPast ? 'hover:bg-primary-light hover:text-primary' : ''}
                        ${isUnavailable || isPast ? 'text-text-light cursor-not-allowed bg-gray-100' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-2">
                {days.map(day => (
                    <div key={day} className="h-8 flex items-center justify-center font-semibold text-primary">
                        {day}
                    </div>
                ))}
                {calendarDays}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-light/20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-primary-light/20 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="text-red-500 text-xl mb-4">Error</div>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => fetchDoctorDetails()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-light/20 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-primary-dark via-primary-semidark to-primary p-6 text-white">
                        <h2 className="text-2xl font-bold text-center">Book Appointment</h2>
                    </div>

                    <div className="p-8">
                        {/* Doctor Info */}
                        {doctor && (
                            <div className="flex items-center space-x-4 mb-8 p-4 bg-primary-light/30 rounded-xl">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    className="w-16 h-16 rounded-full ring-4 ring-white shadow-md"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-text-dark">{doctor.name}</h3>
                                    <p className="text-text-light">{doctor.title} - {doctor.expertise.join(', ')}</p>
                                </div>
                            </div>
                        )}

                        {/* Calendar Section */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <FaCalendarAlt className="text-primary mr-2" />
                                    <h4 className="text-lg font-semibold text-text-dark">Select Date</h4>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handlePrevMonth}
                                        className="p-2 rounded-lg hover:bg-primary-light"
                                    >
                                        <FaChevronLeft className="text-primary" />
                                    </button>
                                    <div className="text-text-dark font-medium">
                                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </div>
                                    <button
                                        onClick={handleNextMonth}
                                        className="p-2 rounded-lg hover:bg-primary-light"
                                    >
                                        <FaChevronRight className="text-primary" />
                                    </button>
                                </div>
                            </div>
                            {renderCalendar()}
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FaClock className="text-primary mr-2" />
                                    <h4 className="text-lg font-semibold text-text-dark">Select Time</h4>
                                </div>

                                {timeSlots.morning.length === 0 && timeSlots.afternoon.length === 0 ? (
                                    <div className="p-4 bg-gray-100 rounded-xl text-center text-text-light">
                                        No available slots for this date
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {timeSlots.morning.length > 0 && (
                                            <div>
                                                <h5 className="text-text-light mb-2">Morning</h5>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {timeSlots.morning.map((time, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleTimeSelect(time)}
                                                            className={`p-3 rounded-xl text-sm font-medium transition-all duration-200
                                                                ${selectedTime === time
                                                                    ? 'bg-primary text-white shadow-lg transform scale-105'
                                                                    : 'bg-primary-light text-primary-semidark hover:bg-primary hover:text-white'
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {timeSlots.afternoon.length > 0 && (
                                            <div>
                                                <h5 className="text-text-light mb-2">Afternoon</h5>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {timeSlots.afternoon.map((time, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleTimeSelect(time)}
                                                            className={`p-3 rounded-xl text-sm font-medium transition-all duration-200
                                                                ${selectedTime === time
                                                                    ? 'bg-primary text-white shadow-lg transform scale-105'
                                                                    : 'bg-primary-light text-primary-semidark hover:bg-primary hover:text-white'
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Symptoms Input */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FaNotesMedical className="text-primary mr-2" />
                                <h4 className="text-lg font-semibold text-text-dark">Symptoms</h4>
                            </div>
                            <textarea
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Please describe your symptoms"
                                rows={3}
                                className="w-full p-4 bg-primary-light/20 border-2 border-primary-light rounded-xl 
                                    text-text-dark placeholder-text-light focus:outline-none focus:border-primary 
                                    transition-colors duration-200 resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedDate || !selectedTime || !symptoms}
                            className={`w-full py-4 rounded-xl font-semibold shadow-lg 
                                transform transition-all duration-200 
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                ${(!selectedDate || !selectedTime || !symptoms)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-secondary hover:bg-secondary/90 text-white hover:scale-105 focus:ring-secondary'
                                }`}
                        >
                            Confirm Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;