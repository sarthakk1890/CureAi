import React from 'react';
import { FaCamera, FaUser, FaEnvelope, FaStethoscope, FaInfoCircle } from 'react-icons/fa';
import { MdLocalPhone } from 'react-icons/md';

const EditProfilePage: React.FC = () => {
    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-2xl font-bold text-text-dark">Edit Profile</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center">
                            <FaUser className="w-8 h-8 text-primary" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                            <FaCamera className="w-4 h-4" />
                        </button>
                    </div>
                    <div>
                        <h3 className="font-medium text-text-dark">Profile Picture</h3>
                        <p className="text-text-light text-sm flex items-center">
                            <FaInfoCircle className="w-4 h-4 mr-2" />
                            JPG, GIF or PNG. Max size of 800K
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                First Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="w-4 h-4 text-text-light" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter first name"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Last Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="w-4 h-4 text-text-light" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="w-4 h-4 text-text-light" />
                            </div>
                            <input
                                type="email"
                                className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter email address"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MdLocalPhone className="w-4 h-4 text-text-light" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Specialization
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaStethoscope className="w-4 h-4 text-text-light" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter specialization"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            About
                        </label>
                        <textarea
                            rows={4}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Write about yourself..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-semidark transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;