import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import useAuthStatus from '../../hooks/isLoggedIn';
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    // const { isLoggedIn } = useAuthStatus();
    const user = useSelector((state: RootState) => state.user.user);
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const navigate = useNavigate();

    // Check if we're on the home page
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            setScrolled(isScrolled);
        };

        // Only add scroll listener on homepage
        if (isHomePage) {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [isHomePage]);

    // Determine if navbar should be white
    const shouldBeWhite = isHomePage && !scrolled;

    return (
        <nav
            className={`sticky top-0 z-50 shadow-md px-6 py-4 transition-all duration-300 ${shouldBeWhite ? 'bg-white' : 'bg-header-gradient'
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <span className={`transition-colors duration-300 ${shouldBeWhite ? 'text-primary-dark' : 'text-white'
                        }`}>
                        Cure
                    </span>
                    <span className={`transition-colors duration-300 ${shouldBeWhite ? 'text-secondary' : 'text-white'
                        }`}>
                        Ai
                    </span>
                </div>

                {/* Navigation Links */}
                <ul className="hidden md:flex items-center space-x-8">
                    <li>
                        <Link
                            to="/"
                            className={`transition-colors duration-200 ${shouldBeWhite
                                ? 'text-text-light hover:text-primary-semidark'
                                : 'text-white hover:text-primary-light'
                                }`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/store"
                            className={`transition-colors duration-200 ${shouldBeWhite
                                ? 'text-text-light hover:text-primary-semidark'
                                : 'text-white hover:text-primary-light'
                                }`}
                        >
                            Store
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/doctors"
                            className={`transition-colors duration-200 ${shouldBeWhite
                                ? 'text-text-light hover:text-primary-semidark'
                                : 'text-white hover:text-primary-light'
                                }`}
                        >
                            Doctors
                        </Link>
                    </li>
                </ul>

                {/* Buttons */}
                <div className="flex items-center space-x-4">
                    <button
                        className={`px-6 py-2 rounded-lg transition-colors duration-200 font-medium ${shouldBeWhite
                            ? 'bg-secondary hover:bg-secondary-dark text-white'
                            : 'bg-white text-secondary hover:bg-secondary hover:text-white'
                            }`}
                    >
                        Contact Us
                    </button>
                    {!isAuthenticated ? (
                        <Link
                            to="/auth"
                            className={`hidden md:block px-4 py-2 font-medium transition-colors duration-200 ${shouldBeWhite
                                ? 'text-primary-semidark hover:text-primary-dark'
                                : 'text-white hover:text-primary-light'
                                }`}
                        >
                            Login
                        </Link>
                    ) : (
                        <span
                            className={`hidden md:block px-4 py-2 font-medium transition-colors duration-200 cursor-pointer ${shouldBeWhite
                                ? 'text-primary-semidark hover:text-primary-dark'
                                : 'text-white hover:text-primary-light'
                                }`}
                            onClick={() => {
                                if (user?.role === 'patient') {
                                    navigate('/patient-dashboard');
                                } else if (user?.role === 'doctor') {
                                    navigate('/doc-dashboard');
                                }
                            }}
                        >
                            <FaUserCircle className={`color ${shouldBeWhite ? 'text-primary-semidark' : 'text-primary-light'} text-3xl`} />
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;