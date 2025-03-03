import { useEffect, useState } from 'react';
import { FaUserMd, FaSearch, FaFilter, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllDoctorsQuery } from '../../redux/api/doctorsAPI';
import { setFilterCriteria, clearFilterCriteria, filterDoctors, Doctor } from '../../redux/reducers/doctorsReducer';
import { RootState } from '../../redux/store';

const DoctorsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data, isLoading, error } = useGetAllDoctorsQuery(undefined);

    const doctorsData = data?.data;

    const { filteredDoctors: filteredData, loading } = useSelector((state: RootState) => state.doctor);

    const filteredDoctors = Array.isArray(filteredData) ? filteredData : [];

    const allSpecialties = doctorsData ? doctorsData.reduce((acc: string[], doctor: Doctor) => {
        doctor.expertise?.forEach(specialty => {
            if (!acc.includes(specialty)) {
                acc.push(specialty);
            }
        });
        return acc;
    }, []) : [];

    useEffect(() => {
        if (doctorsData) {
            dispatch(filterDoctors(doctorsData));
        }
    }, [doctorsData, dispatch]);

    useEffect(() => {
        if (doctorsData) {
            if (filterSpecialty) {
                dispatch(setFilterCriteria({ expertise: [filterSpecialty] }));
            } else {
                dispatch(clearFilterCriteria());
            }

            dispatch(filterDoctors(doctorsData));
        }
    }, [filterSpecialty, doctorsData, dispatch]);

    const displayedDoctors = Array.isArray(filteredDoctors) ?
        filteredDoctors.filter(doctor =>
            doctor && doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-primary-dark mb-3 tracking-tight">Find Your Doctor</h1>
                    <p className="text-text-light text-xl">Connect with the best healthcare professionals</p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 transform transition-all duration-300 hover:shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaSearch className="text-primary-semidark" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search doctors by name..."
                                className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="relative md:w-72">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaFilter className="text-primary-semidark" />
                            </div>
                            <select
                                className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-gray-50 text-base"
                                value={filterSpecialty}
                                onChange={(e) => setFilterSpecialty(e.target.value)}
                            >
                                <option value="">All Specialties</option>
                                {allSpecialties.map((specialty: string, index: number) => (
                                    <option key={index} value={specialty}>{specialty}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Counter */}
                <div className="mb-8 flex items-center justify-between">
                    <p className="text-text-light text-lg">
                        Found <span className="font-semibold text-primary-dark">{displayedDoctors.length}</span> doctors
                        {filterSpecialty && <span> specializing in <span className="font-semibold text-primary-dark">{filterSpecialty}</span></span>}
                    </p>

                    {(filterSpecialty || searchTerm) && (
                        <button
                            className="text-primary-dark hover:text-primary-semidark text-sm flex items-center gap-2 py-2 px-4 rounded-lg border border-primary-dark/30 hover:border-primary-dark transition-all duration-300"
                            onClick={() => {
                                setSearchTerm('');
                                setFilterSpecialty('');
                                dispatch(clearFilterCriteria());
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Loading State */}
                {(isLoading || loading) && (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 mb-6 text-center">
                        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 className="text-xl font-semibold mb-2">Error loading doctors</h3>
                        <p>Please try again later or contact support if the problem persists.</p>
                    </div>
                )}

                {/* Doctors Listing */}
                {!isLoading && !loading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {displayedDoctors.length > 0 ? (
                            displayedDoctors.map(doctor => (
                                <div
                                    key={doctor._id}
                                    className="bg-white border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                    onClick={() => navigate(`/doctor/${doctor._id}`)}
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/3 p-6 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-semidark">
                                            <div className="relative">
                                                <img
                                                    src={doctor.image || "/placeholder_doctor.avif"}
                                                    alt={doctor.name}
                                                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/placeholder_doctor.avif";
                                                    }}
                                                />
                                                <div className="absolute -bottom-2 -right-2 bg-primary-dark text-white rounded-full px-4 py-1 text-sm font-bold shadow-md">
                                                    {doctor.experience} {doctor.experience === 1 ? 'yr' : 'yrs'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:w-2/3 p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <h2 className="text-2xl font-bold text-text-dark">{doctor.name}</h2>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {doctor.expertise?.map((specialty, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-primary-light/30 text-primary-dark px-3 py-1 rounded-full text-xs font-medium"
                                                        >
                                                            {specialty}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-center text-text-light">
                                                    <FaCalendarAlt className="text-primary-semidark mr-2 flex-shrink-0" />
                                                    <span>Experience: <span className="font-medium">{doctor.experience} {doctor.experience === 1 ? 'year' : 'years'}</span></span>
                                                </div>

                                                <div className="flex items-center text-text-light">
                                                    <FaPhone className="text-primary-semidark mr-2 flex-shrink-0" />
                                                    <span>{doctor.phone}</span>
                                                </div>

                                                <div className="flex items-center text-text-light">
                                                    <MdEmail className="text-primary-semidark mr-2 flex-shrink-0" />
                                                    <span className="truncate">{doctor.email}</span>
                                                </div>
                                            </div>

                                            <div className="mt-5 pt-4 border-t border-gray-100">
                                                <button className="w-full bg-primary-dark text-white py-3 rounded-xl hover:bg-primary-semidark transition-colors duration-300 font-medium">
                                                    Book Appointment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full bg-white rounded-2xl shadow-md text-center py-20 px-6">
                                <FaUserMd className="text-primary-light text-6xl mx-auto mb-6 opacity-40" />
                                <h3 className="text-2xl font-semibold text-text-dark mb-3">No doctors found</h3>
                                <p className="text-text-light mb-8 max-w-md mx-auto">We couldn't find any doctors matching your search criteria. Try adjusting your filters or search term.</p>
                                <button
                                    className="bg-primary-dark text-white px-8 py-3 rounded-xl hover:bg-primary-semidark transition-colors duration-300 shadow-md"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterSpecialty('');
                                        dispatch(clearFilterCriteria());
                                    }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsList;