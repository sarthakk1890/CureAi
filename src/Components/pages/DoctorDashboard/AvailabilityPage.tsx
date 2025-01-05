import React, { useState } from 'react';
import { FaClock, FaPlus, FaTrash, FaSave } from 'react-icons/fa';

type TimeSlot = {
    start: string;
    end: string;
};

type DaySchedule = {
    day: string;
    isActive: boolean;
    slots: TimeSlot[];
};

const AvailabilityPage: React.FC = () => {
    const [schedule, setSchedule] = useState<DaySchedule[]>([
        { day: 'Monday', isActive: true, slots: [{ start: '09:00', end: '17:00' }] },
        { day: 'Tuesday', isActive: true, slots: [{ start: '09:00', end: '17:00' }] },
        { day: 'Wednesday', isActive: true, slots: [{ start: '09:00', end: '17:00' }] },
        { day: 'Thursday', isActive: true, slots: [{ start: '09:00', end: '17:00' }] },
        { day: 'Friday', isActive: true, slots: [{ start: '09:00', end: '17:00' }] },
        { day: 'Saturday', isActive: false, slots: [{ start: '09:00', end: '13:00' }] },
        { day: 'Sunday', isActive: false, slots: [] },
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const toggleDay = (dayIndex: number) => {
        setSchedule(prev => prev.map((day, index) =>
            index === dayIndex ? { ...day, isActive: !day.isActive } : day
        ));
    };

    const addTimeSlot = (dayIndex: number) => {
        setSchedule(prev => prev.map((day, index) =>
            index === dayIndex
                ? {
                    ...day,
                    slots: [...day.slots, { start: '09:00', end: '17:00' }]
                }
                : day
        ));
    };

    const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
        setSchedule(prev => prev.map((day, index) =>
            index === dayIndex
                ? {
                    ...day,
                    slots: day.slots.filter((_, idx) => idx !== slotIndex)
                }
                : day
        ));
    };

    const updateTimeSlot = (
        dayIndex: number,
        slotIndex: number,
        field: 'start' | 'end',
        value: string
    ) => {
        setSchedule(prev => prev.map((day, index) =>
            index === dayIndex
                ? {
                    ...day,
                    slots: day.slots.map((slot, idx) =>
                        idx === slotIndex
                            ? { ...slot, [field]: value }
                            : slot
                    )
                }
                : day
        ));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setMessage(null);

        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage({ type: 'success', text: 'Availability settings saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save availability settings. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-text-dark">Availability Settings</h1>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-4 sm:mt-0 w-full sm:w-auto bg-primary text-white px-6 py-2 rounded hover:bg-primary-semidark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    <FaSave className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                <div className="space-y-6">
                    {schedule.map((day, dayIndex) => (
                        <div key={day.day} className="border-b last:border-0 pb-4 last:pb-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-4">
                                <div className="flex items-center space-x-4">
                                    <FaClock className="w-5 h-5 text-primary" />
                                    <span className="font-medium text-text-dark">{day.day}</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={day.isActive}
                                        onChange={() => toggleDay(dayIndex)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            {day.isActive && (
                                <div className="pl-0 sm:pl-9 space-y-4">
                                    {day.slots.map((slot, slotIndex) => (
                                        <div key={slotIndex} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                            <input
                                                type="time"
                                                value={slot.start}
                                                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                                                className="w-full sm:w-auto p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <span className="text-text-light">to</span>
                                            <input
                                                type="time"
                                                value={slot.end}
                                                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                                                className="w-full sm:w-auto p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <button
                                                onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                                                className="text-text-light hover:text-red-500 transition-colors p-2"
                                                title="Remove time slot"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addTimeSlot(dayIndex)}
                                        className="flex items-center text-primary hover:text-primary-semidark transition-colors"
                                    >
                                        <FaPlus className="w-4 h-4 mr-2" />
                                        Add Time Slot
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-primary-light p-4 rounded-lg text-primary-dark text-sm">
                <ul className="list-disc list-inside space-y-1">
                    <li>Toggle the switch to enable/disable availability for each day</li>
                    <li>Add multiple time slots for each day if needed</li>
                    <li>Click the trash icon to remove a time slot</li>
                    <li>All times are in 24-hour format</li>
                </ul>
            </div>
        </div>
    );
};

export default AvailabilityPage;