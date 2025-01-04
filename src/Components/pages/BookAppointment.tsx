import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaNotesMedical, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Doctors from '../../static-data/doctorData.json';
import Appointments from '../../static-data/appointmentData.json';
import toast from 'react-hot-toast';

interface Doctor {
    id: string;
    name: string;
    image: string;
    specialty: string;
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

type DoctorAvailability = {
    id: string;
    defaultTimeSlots: {
        morning: string[];
        afternoon: string[];
    };
    unavailableDates: string[];
    modifiedTimeSlots: { [key: string]: TimeSlots | undefined }; // Allow undefined
};

const BookAppointment: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [symptoms, setSymptoms] = useState<string>('');
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [doctorAvailability, setDoctorAvailability] = useState<DoctorAvailability | null>(null);
    const [timeSlots, setTimeSlots] = useState<TimeSlots>({ morning: [], afternoon: [] });

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        window.scrollTo(0, 0);
        const docDetails = Doctors.find((doc) => doc.id === id);
        const availability = Appointments.find((app) => app.id === id);

        if (docDetails && availability) {
            setDoctor(docDetails);
            setDoctorAvailability(availability);
        }
    }, [id]);

    const isWeekend = (date: Date): boolean => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isUnavailableDate = (date: Date): boolean => {
        if (!doctorAvailability) return true;

        const formattedDate = formatDate(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return (
            doctorAvailability.unavailableDates.includes(formattedDate) ||
            isWeekend(date) ||
            date < today
        );
    };

    const getTimeSlotsForDate = (date: Date): TimeSlots => {
        if (!doctorAvailability) return { morning: [], afternoon: [] };

        const formattedDate = formatDate(date);
        return doctorAvailability.modifiedTimeSlots[formattedDate] ||
            doctorAvailability.defaultTimeSlots;
    };

    const handleDateSelect = (date: Date) => {
        const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        setSelectedDate(newDate);
        setSelectedTime(null);
        setTimeSlots(getTimeSlotsForDate(newDate));
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

    // const handleSubmit = () => {
    //     if (selectedDate && selectedTime && symptoms) {
    //         setAppointment({
    //             date: formatDate(selectedDate),
    //             timeSlot: selectedTime,
    //             symptoms,
    //         });
    //         toast.success('Appointment booked successfully!');
    //     } else {
    //         toast.error('Please fill all the fields');
    //     }
    // };

    const handleSubmit = () => {
        if (selectedDate && selectedTime && symptoms) {
            const newAppointment = {
                date: formatDate(selectedDate),
                timeSlot: selectedTime,
                symptoms,
            };

            setAppointment(newAppointment);

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
                                            Appointment booked successfully!
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
                                        <span className="ml-2 text-sm text-gray-700">{newAppointment.date}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-semibold text-gray-600">Time:</span>
                                        <span className="ml-2 text-sm text-gray-700">{newAppointment.timeSlot}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-sm font-semibold text-gray-600">Symptoms:</span>
                                        <span className="ml-2 text-sm text-gray-700">{newAppointment.symptoms}</span>
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

            setSelectedDate(null);
            setSelectedTime(null);
            setSymptoms('');

        } else {
            toast.error('Please fill all the fields');
        }
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
            const hasModifiedSlots = doctorAvailability?.modifiedTimeSlots[formattedDate];

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
                        ${isWeekend(date) ? 'bg-gray-200' : ''}
                    `}
                >
                    <span className="relative">
                        {day}
                        {hasModifiedSlots && (
                            <span
                                className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full"
                                style={{ transform: 'translate(100%, -50%)' }}
                            />
                        )}
                    </span>
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
                        <div className="flex items-center space-x-4 mb-8 p-4 bg-primary-light/30 rounded-xl">
                            <img
                                src={doctor?.image || ''}
                                alt={doctor?.name || 'Doctor'}
                                className="w-16 h-16 rounded-full ring-4 ring-white shadow-md"
                            />
                            <div>
                                <h3 className="text-xl font-semibold text-text-dark">{doctor?.name}</h3>
                                <p className="text-text-light">Select your preferred time slot</p>
                            </div>
                        </div>

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
                                <div className="space-y-4">
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
                                </div>
                            </div>
                        )}

                        {/* Symptoms Input */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FaNotesMedical className="text-primary mr-2" />
                                <h4 className="text-lg font-semibold text-text-dark">Symptoms</h4>
                            </div>
                            <input
                                type="text"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Please describe your symptoms"
                                className="w-full p-4 bg-primary-light/20 border-2 border-primary-light rounded-xl 
                                    text-text-dark placeholder-text-light focus:outline-none focus:border-primary 
                                    transition-colors duration-200"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full py-4 bg-secondary hover:bg-secondary/90 text-white rounded-xl 
                                font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 
                                focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                        >
                            Confirm Appointment
                        </button>

                        {/* Confirmation */}
                        {appointment && doctor && (
                            <div className="mt-8 p-6 bg-primary-light/30 rounded-xl">
                                <div className="flex items-center justify-center mb-4">
                                    <FaCheckCircle className="text-primary text-xl mr-2" />
                                    <h5 className="text-xl font-semibold text-primary-dark">Appointment Confirmed</h5>
                                </div>
                                <div className="space-y-2 text-center text-text-dark">
                                    <p><span className="font-medium">Doctor:</span> {doctor.name}</p>
                                    <p><span className="font-medium">Date:</span> {appointment.date}</p>
                                    <p><span className="font-medium">Time:</span> {appointment.timeSlot}</p>
                                    <p><span className="font-medium">Symptoms:</span> {appointment.symptoms}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;