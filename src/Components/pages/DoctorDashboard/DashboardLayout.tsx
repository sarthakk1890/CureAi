import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaClock, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useDispatch } from "react-redux";
import { logout } from '../../../redux/reducers/userReducer';


type SidebarLink = {
    name: string;
    icon: React.ReactNode;
    path: string;
};

const DashboardLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarLinks: SidebarLink[] = [
        { name: 'Meetings', icon: <FaCalendarAlt className="w-5 h-5" />, path: 'meetings' },
        { name: 'Edit Profile', icon: <FaUser className="w-5 h-5" />, path: 'profile' },
        { name: 'Availability', icon: <FaClock className="w-5 h-5" />, path: 'availability' },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout()); // Clear user state
        navigate("/"); // Redirect to home page
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
            >
                {isSidebarOpen ? (
                    <FaTimes className="w-6 h-6 text-primary" />
                ) : (
                    <FaBars className="w-6 h-6 text-primary" />
                )}
            </button>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo */}
                <div className="h-20 flex items-center justify-center border-b">
                    <Link to="/">
                        <div className="text-2xl font-bold">
                            <span className="transition-colors duration-300 text-primary-dark">
                                Cure
                            </span>
                            <span className="transition-colors duration-300 text-secondary">
                                Ai
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="mt-8">
                    <ul className="space-y-2">
                        {sidebarLinks.map((link) => (
                            <li key={link.name}>
                                <button
                                    onClick={() => handleNavigation(link.path)}
                                    className="w-full flex items-center px-6 py-3 text-text-light hover:bg-primary-light hover:text-primary-dark transition-colors"
                                >
                                    {link.icon}
                                    <span className="ml-3">{link.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-8 w-64">
                    <button
                        className="w-full flex items-center px-6 py-3 text-text-light hover:bg-primary-light hover:text-primary-dark transition-colors"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="w-5 h-5" />
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full lg:ml-0 mt-16 lg:mt-0">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;