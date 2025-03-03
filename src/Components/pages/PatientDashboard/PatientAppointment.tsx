import { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineCalendar } from 'react-icons/ai';
import { BiTime } from 'react-icons/bi';
import { FaVideo } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-hot-toast';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

interface PatientDetails {
    name: string;
    age: number;
    gender: Gender;
    symptoms: string;
}

interface Doctor {
    name: string;
    specialization?: string;
}

interface Appointment {
    _id: string;
    doctorId: Doctor;
    date: string;
    time_slot: string;
    meet_link: string;
    status?: 'Upcoming' | 'Scheduled' | 'Completed' | 'Cancelled';
    patientDetails: PatientDetails;
}

const Appointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Unauthorized: No token found.');
                    return;
                }

                const response = await axios.get<{ appointments: Appointment[] }>(
                    'https://cureback-ts.onrender.com/api/appointment/all',
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setAppointments(response.data.appointments);
            } catch (err) {
                setError('Failed to fetch appointments.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://cureback-ts.onrender.com/api/appointment/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
            toast.success("Appointment deleted successfully!");
        } catch (error) {
            console.error("Error deleting appointment:", error);
            toast.error("Failed to delete appointment.");
        }
    };

    if (loading) {
        return <div className="text-center text-primary-dark text-lg font-medium">Loading appointments...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 font-medium">{error}</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">My Appointments</h2>

            {appointments.length === 0 ? (
                <div className="text-center text-text-light text-lg">No appointments found.</div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment._id}
                            className="border border-primary-light rounded-xl p-5 hover:shadow-md hover:bg-primary-light transition-all"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-text-dark text-lg font-medium">
                                        With <span className="text-primary italic">{appointment.doctorId.name}</span>
                                    </p>
                                    <p className="text-text-light text-sm">{appointment.doctorId.specialization}</p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                                    ${appointment.status === 'Upcoming' ? 'bg-primary text-white' : ''}
                                    ${appointment.status === 'Completed' ? 'bg-green-500 text-white' : ''}
                                    ${appointment.status === 'Cancelled' ? 'bg-red-500 text-white' : ''}
                                    ${appointment.status === 'Scheduled' ? 'bg-secondary text-white' : ''}`}
                                >
                                    {appointment.status || 'Scheduled'}
                                </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-sm text-text-dark">
                                <div className="flex items-center">
                                    <AiOutlineCalendar className="w-5 h-5 mr-1 text-primary" />
                                    {new Date(appointment.date).toLocaleDateString()}
                                    <BiTime className="w-5 h-5 ml-3 mr-1 text-primary" />
                                    {appointment.time_slot}
                                </div>

                                <div className="flex items-center space-x-3">
                                    {appointment.meet_link && (
                                        <a
                                            href={appointment.meet_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-lg transition-all"
                                        >
                                            <FaVideo className="w-4 h-4 mr-2" />
                                            Join Meeting
                                        </a>
                                    )}

                                    <button
                                        onClick={() => handleDelete(appointment._id)}
                                        className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all"
                                    >
                                        <MdDelete className="w-5 h-5 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Appointments;
