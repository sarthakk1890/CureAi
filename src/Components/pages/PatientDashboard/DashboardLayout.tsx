import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './PatientSidebar';
import Appointments from './PatientAppointment';
import UpdateProfileModal from './PatientUpdate';
import Orders from './PatientOrders';
import PatientDetails from './PatientDetails';
import { logout } from '../../../redux/reducers/userReducer';

const DashboardLayout = () => {
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'orders'>('dashboard');
    const dispatch = useDispatch();

    // Get patient data from Redux store
    const patientData = useSelector((state: any) => state.user.user);

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/";
    };

    // If patient data is not loaded yet, show a loading state
    if (!patientData) {
        return <div className="min-h-screen bg-primary-light p-6 flex items-center justify-center">
            <div className="text-xl text-primary-dark">Loading...</div>
        </div>;
    }

    return (
        <div className="relative">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="min-h-screen bg-primary-light p-6 ml-64">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-primary-dark">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => setUpdateModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-semidark text-white rounded-lg transition-colors"
                        >
                            <FiEdit className="w-4 h-4 mr-2" />
                            Update Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-lg transition-colors"
                        >
                            <RiLogoutBoxLine className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'appointments' && (
                    <Appointments />
                )}
                {activeTab === 'dashboard' && (
                    <PatientDetails patient={patientData} />
                )}
                {activeTab === 'orders' && (
                    <Orders />
                )}
            </div>

            <UpdateProfileModal
                isOpen={isUpdateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                patient={patientData}
            />
        </div>
    );
};

export default DashboardLayout;