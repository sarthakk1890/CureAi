import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPhoneAlt, FaCalendarCheck, FaBriefcaseMedical, FaHospital, FaClock } from 'react-icons/fa';
import Doctors from '../../static-data/doctorData.json';

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    yearsOfExperience: number;
    hospital: string;
    phone: string;
    image: string;
    about: string;
}

const DoctorDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        setDoctor(Doctors.find((doc) => doc.id === id) || null);
    }, [id]);

    if (!doctor) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-primary-light h-12 w-12"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-primary-light rounded w-64"></div>
                        <div className="h-4 bg-primary-light rounded w-52"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-light/20">
            {/* Hero Section with Background */}
            <div className="bg-gradient-to-r from-primary-dark via-primary-semidark to-primary h-48"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    {/* Doctor's Header Section */}
                    <div className="md:flex p-8">
                        {/* Doctor's Image */}
                        <div className="flex-shrink-0">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="h-64 w-64 rounded-lg object-cover shadow-lg ring-4 ring-white"
                            />
                        </div>

                        {/* Doctor's Basic Info */}
                        <div className="md:ml-8 mt-6 md:mt-0">
                            <h1 className="text-3xl font-bold text-text-dark">{doctor.name}</h1>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center text-text-light">
                                    <FaBriefcaseMedical className="h-5 w-5 text-primary" />
                                    <span className="ml-3">{doctor.specialty}</span>
                                </div>
                                <div className="flex items-center text-text-light">
                                    <FaClock className="h-5 w-5 text-primary" />
                                    <span className="ml-3">{doctor.yearsOfExperience} years of experience</span>
                                </div>
                                <div className="flex items-center text-text-light">
                                    <FaHospital className="h-5 w-5 text-primary" />
                                    <span className="ml-3">{doctor.hospital}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="px-8 py-6 border-t border-primary-light">
                        <h2 className="text-xl font-semibold text-text-dark">About</h2>
                        <p className="mt-4 text-text-light leading-relaxed">{doctor.about}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-8 py-6 bg-primary-light/20 border-t border-primary-light">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => (window.location.href = `tel:${doctor.phone}`)}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-semidark hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                            >
                                <FaPhoneAlt className="mr-2 h-5 w-5" />
                                Call Doctor
                            </button>
                            <button
                                onClick={() => navigate(`/doctor/${doctor.id}/appointment`)}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"
                            >
                                <FaCalendarCheck className="mr-2 h-5 w-5" />
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;