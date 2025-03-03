import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaClock, FaLink, FaVenusMars, FaNotesMedical } from 'react-icons/fa';

interface Appointment {
    _id: string;
    date: string;
    time_slot: string;
    meet_link: string;
    patientDetails: {
        name: string;
        age: number;
        gender: string;
        symptoms: string;
    };
}

const MeetingsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Get doctorId from Redux state

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`https://cureback-ts.onrender.com/api/appointment/all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.data && response.data.appointments) {
                    setAppointments(response.data.appointments);
                } else {
                    setError('Received unexpected data format from server');
                }
            } catch (err: any) {
                setError(`Failed to fetch appointments: ${err.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // Helper function to format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            <p className="font-medium">{error}</p>
        </div>
    );

    if (appointments.length === 0) return (
        <div className="bg-blue-50 border border-blue-200 text-blue-600 p-6 rounded-lg text-center">
            <p className="font-medium text-lg">No appointments scheduled at this time.</p>
            <p className="mt-2">Check back later for new appointments.</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-dark">My Appointments</h1>
                <span className="bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-full font-medium">
                    {appointments.length} Appointment{appointments.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="grid gap-6">
                {appointments.map((appointment) => (
                    <div
                        key={appointment._id}
                        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                        <div className="border-l-4 border-primary p-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                                        <FaUser className="w-8 h-8 text-primary" />
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-dark">{appointment.patientDetails.name}</h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="flex items-center text-sm text-gray-600">
                                                    <span className="flex items-center">
                                                        <FaVenusMars className="w-4 h-4 mr-1 text-gray-500" />
                                                        {appointment.patientDetails.gender}, {appointment.patientDetails.age} years
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <FaNotesMedical className="w-4 h-4 mt-1 text-gray-500" />
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium text-gray-900">Symptoms:</span> {appointment.patientDetails.symptoms}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <span className="flex items-center text-sm bg-blue-50 px-3 py-2 rounded-full text-blue-700">
                                                <FaCalendarAlt className="w-4 h-4 mr-2" />
                                                {formatDate(appointment.date)}
                                            </span>
                                            <span className="flex items-center text-sm bg-green-50 px-3 py-2 rounded-full text-green-700">
                                                <FaClock className="w-4 h-4 mr-2" />
                                                {appointment.time_slot}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <a
                                        href={appointment.meet_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition duration-200"
                                    >
                                        <FaLink className="w-4 h-4 mr-2" />
                                        Join Meeting
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingsPage;