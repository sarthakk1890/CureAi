import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

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
                            to="/doc-dashboard"
                            className={`transition-colors duration-200 ${shouldBeWhite
                                ? 'text-text-light hover:text-primary-semidark'
                                : 'text-white hover:text-primary-light'
                                }`}
                        >
                            DocDash
                        </Link>
                    </li>
                </ul>

                {/* Buttons */}
                <div className="flex items-center space-x-4">
                    <Link
                        to="/auth"
                        className={`hidden md:block px-4 py-2 font-medium transition-colors duration-200 ${shouldBeWhite
                            ? 'text-primary-semidark hover:text-primary-dark'
                            : 'text-white hover:text-primary-light'
                            }`}
                    >
                        Login
                    </Link>
                    <button
                        className={`px-6 py-2 rounded-lg transition-colors duration-200 font-medium ${shouldBeWhite
                            ? 'bg-secondary hover:bg-secondary-dark text-white'
                            : 'bg-white text-secondary hover:bg-secondary hover:text-white'
                            }`}
                    >
                        Contact Us
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;