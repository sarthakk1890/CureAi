import { useEffect, useState } from 'react';
import { app } from '../../utils/firebase';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    useEnterMutation,
    useGetUserDetailsQuery
} from '../../redux/api/userAPI';
import { setUser } from '../../redux/reducers/userReducer';
import { LoadingSpinner } from '../layout/Spinner';
import useAuthStatus from '../../hooks/isLoggedIn';

type UserRole = 'doctor' | 'patient';

const auth = getAuth(app);

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.785 9.169c0-.738-.06-1.276-.189-1.834h-8.42v3.328h4.842c-.1.828-.638 2.073-1.834 2.91l-.016.112 2.662 2.063.185.018c1.694-1.565 2.67-3.867 2.67-6.597z" />
        <path fill="#34A853" d="M9.175 17.938c2.422 0 4.455-.797 5.94-2.172l-2.83-2.193c-.758.528-1.774.897-3.11.897-2.372 0-4.385-1.564-5.102-3.727l-.105.01-2.769 2.142-.036.1c1.475 2.93 4.504 4.943 8.012 4.943z" />
        <path fill="#FBBC05" d="M4.073 10.743c-.19-.558-.3-1.156-.3-1.774 0-.618.11-1.216.29-1.774l-.005-.119L1.254 4.9l-.091.044C.555 6.159.206 7.524.206 8.969c0 1.445.349 2.81.957 4.026l2.91-2.252z" />
        <path fill="#EB4335" d="M9.175 3.468c1.684 0 2.82.728 3.468 1.335l2.531-2.471C13.62.9 11.598 0 9.175 0 5.667 0 2.638 2.013 1.163 4.943l2.9 2.252c.727-2.162 2.74-3.727 5.112-3.727z" />
    </svg>
);

const LoginSignUp = () => {
    const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldFetchUser, setShouldFetchUser] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoggedIn } = useAuthStatus();

    // Redux hooks
    const [enter] = useEnterMutation();

    // Only fetch user details when shouldFetchUser is true
    const { data: userData, error: userDataError } = useGetUserDetailsQuery(undefined, {
        skip: !shouldFetchUser,
    });

    // Effect to handle user data when it's fetched
    useEffect(() => {
        if (userData) {
            dispatch(setUser(userData.user));
            setShouldFetchUser(false); // Reset the flag
            navigate('/');
        }

        if (userDataError) {
            console.error('Error fetching user details:', userDataError);
            setError('Failed to fetch user details');
            setShouldFetchUser(false);
        }
    }, [userData, userDataError, navigate, dispatch]);

    if (isLoggedIn) {
        navigate('/');
    }

    const handleAuthSuccess = async (response: { token: string; user: any }) => {
        localStorage.setItem('token', response.token);
        setShouldFetchUser(true); // Trigger user details fetch
    };

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user) {
                setError("Authentication failed");
                setIsLoading(false);
                return;
            }

            try {
                const userData = {
                    google_id: user.uid,
                    name: user.displayName || '',
                    email: user.email || '',
                    image: user.photoURL || '',
                    role: selectedRole
                };

                const response = await enter(userData).unwrap();
                await handleAuthSuccess(response);
            } catch (enterError: any) {
                setError(enterError.message || "Authentication failed. Please try again.");
                console.error('Enter Error:', enterError);
            }
        } catch (error: any) {
            setError(error.message || "Authentication failed. Please try again.");
            console.error('Auth Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[100dvh] flex flex-col items-center justify-center bg-primary-light">
            <div className="mb-8 text-center">
                <h1 className="text-5xl font-bold">
                    <span className="text-primary-dark">Cure</span>
                    <span className="text-secondary">Ai</span>
                </h1>
                <div className="h-1 w-16 bg-primary mx-auto mt-2 rounded-full" />
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary-dark mb-2">
                        Welcome to CureAi
                    </h2>
                    <p className="text-text-light">
                        Continue with your Google account
                    </p>
                </div>

                <div className="mb-6">
                    <p className="text-center text-text-light mb-3">I am a:</p>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setSelectedRole('patient')}
                            className={`flex-1 py-3 rounded-lg transition-all relative ${selectedRole === 'patient' ? 'text-white z-10' : 'text-text-light'
                                } ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                        >
                            {selectedRole === 'patient' && (
                                <span className="absolute inset-0 bg-primary rounded-lg -z-10 animate-fadeIn" />
                            )}
                            Patient
                        </button>
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setSelectedRole('doctor')}
                            className={`flex-1 py-3 rounded-lg transition-all relative ${selectedRole === 'doctor' ? 'text-white z-10' : 'text-text-light'
                                } ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                        >
                            {selectedRole === 'doctor' && (
                                <span className="absolute inset-0 bg-primary rounded-lg -z-10 animate-fadeIn" />
                            )}
                            Doctor
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-center mb-4">
                        Some error occurred. Please try again!
                    </div>
                )}

                <div className="flex justify-center align-center mt-5">
                    <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className={`flex items-center justify-center gap-3 bg-primary-semidark hover:bg-primary-dark text-white font-medium py-1 pl-1 pr-5 transition-colors min-w-[200px] h-[40px] ${isLoading ? 'cursor-not-allowed opacity-70' : ''
                            }`}
                    >
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <div className="bg-white p-2">
                                    <GoogleIcon />
                                </div>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginSignUp;