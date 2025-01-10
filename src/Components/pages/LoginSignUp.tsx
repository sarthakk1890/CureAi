import { useState } from 'react';
import { CiLock, CiMail, CiUser } from 'react-icons/ci';
import { FaRegEye } from 'react-icons/fa';
import { RiEyeCloseFill } from 'react-icons/ri';

type AuthMode = 'login' | 'signup';

interface FormData {
    email: string;
    password: string;
    name?: string;
}

const LoginSignUp = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        name: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle authentication logic here
        console.log('Form submitted:', formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light">
            {/* Logo */}
            <div className="mb-8 text-center">
                <h1 className="text-5xl font-bold">
                    <span className="text-primary-dark">Cure</span>
                    <span className="text-secondary">Ai</span>
                </h1>
                <div className="h-1 w-16 bg-primary mx-auto mt-2 rounded-full" />
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary-dark mb-2">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-text-light">
                        {mode === 'login'
                            ? 'Enter your credentials to access your account'
                            : 'Fill in your details to get started'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === 'signup' && (
                        <div className="relative">
                            <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={20} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary hover:border-primary transition-colors"
                                required={mode === 'signup'}
                            />
                        </div>
                    )}

                    <div className="relative">
                        <CiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary hover:border-primary transition-colors"
                            required
                        />
                    </div>

                    <div className="relative">
                        <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary hover:border-primary transition-colors"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light hover:text-primary-semidark transition-colors"
                        >
                            {showPassword ? <RiEyeCloseFill size={20} /> : <FaRegEye size={20} />}
                        </button>
                    </div>

                    {mode === 'login' && (
                        <div className="text-right">
                            <button type="button" className="text-primary-semidark hover:text-primary-dark text-sm transition-colors">
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-semidark text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* Mode Toggle */}
                <div className="mt-6 text-center">
                    <p className="text-text-light">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-secondary hover:text-primary-dark font-semibold transition-colors"
                        >
                            {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginSignUp;