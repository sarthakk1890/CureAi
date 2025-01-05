import React from 'react';
import { FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';

type Meeting = {
    id: string;
    patientName: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled';
};

const MeetingsPage: React.FC = () => {
    const meetings: Meeting[] = [
        {
            id: '1',
            patientName: 'John Doe',
            date: '2024-01-05',
            time: '10:00 AM',
            status: 'upcoming',
        },
        // Add more mock meetings as needed
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text-dark">My Meetings</h1>

            <div className="grid gap-4">
                {meetings.map((meeting) => (
                    <div
                        key={meeting.id}
                        className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-100"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                <FaUser className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-text-dark">{meeting.patientName}</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-text-light text-sm">
                                        <span className="flex items-center">
                                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                                            {meeting.date}
                                        </span>
                                        <span className="flex items-center">
                                            <FaClock className="w-4 h-4 mr-2" />
                                            {meeting.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm text-center ${meeting.status === 'upcoming' ? 'bg-primary-light text-primary-dark' :
                                    meeting.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                                        'bg-red-100 text-red-600'
                                }`}>
                                {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingsPage;