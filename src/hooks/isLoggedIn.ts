import { useState, useEffect } from 'react';

const useAuthStatus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = () => {
            try {
                // Check for authentication token in localStorage
                const token = localStorage.getItem('token');

                // You can add additional validation here
                // For example, check if the token is expired
                if (token) {
                    try {
                        const tokenData = JSON.parse(atob(token.split('.')[1]));
                        const isExpired = tokenData.exp < Date.now() / 1000;

                        setIsLoggedIn(!isExpired);
                    } catch (error) {
                        console.error('Error parsing token:', error);
                        setIsLoggedIn(false);
                    }
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        // Check auth status immediately
        checkAuthStatus();

        // Set up event listener for storage changes
        window.addEventListener('storage', checkAuthStatus);

        // Optional: Set up interval to periodically check token expiration
        const interval = setInterval(checkAuthStatus, 60000); // Check every minute

        // Cleanup
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
            clearInterval(interval);
        };
    }, []);

    return { isLoggedIn, loading };
};

export default useAuthStatus;