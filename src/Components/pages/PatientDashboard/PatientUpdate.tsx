import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
// import { BsUpload } from 'react-icons/bs';
import { FaCamera, FaUser, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { setUser } from '../../../redux/reducers/userReducer';
import { useDispatch } from 'react-redux';
import { useUpdatePatientProfileMutation } from '../../../redux/api/userAPI';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

type Patient = {
    name: string;
    email: string;
    age: number;
    phone: string;
    bloodGroup: string;
    gender: Gender;
    image: string;
};

type UpdateProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient;
};

const GENDER: Record<Gender, Gender> = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER'
};

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isOpen, onClose, patient }) => {
    const [formData, setFormData] = useState<Omit<Patient, 'age'> & { age: string | number }>(() => ({
        name: patient?.name || '',
        email: patient?.email || '',
        age: patient?.age || '',
        phone: patient?.phone || '',
        bloodGroup: patient?.bloodGroup || '',
        gender: patient?.gender || GENDER.OTHER,
        image: patient?.image || ''
    }));

    const dispatch = useDispatch();
    const [updatePatientProfile] = useUpdatePatientProfileMutation();

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;

        // Upload new image to Cloudinary
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "user_profile_pics"); // Cloudinary upload preset

        try {
            toast.promise(
                axios.post("https://api.cloudinary.com/v1_1/dzxg41hqi/image/upload", formDataUpload),
                {
                    loading: 'Uploading image...',
                    success: 'Image uploaded successfully!',
                    error: 'Failed to upload image',
                }
            ).then(response => {
                if (response.data.secure_url) {
                    console.log("File available at", response.data.secure_url);
                    setFormData((prev) => ({ ...prev, image: response.data.secure_url }));
                }
            }).catch(error => {
                console.error("Error uploading image:", error);
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Convert age to number before submitting
        const dataToSubmit = {
            ...formData,
            age: formData.age === '' ? null : Number(formData.age),
            gender: formData.gender.toLowerCase()
        };

        toast.promise(
            updatePatientProfile(dataToSubmit).unwrap().then((response) => {
                dispatch(setUser(response.data));
                return response;
            }),
            {
                loading: 'Updating profile...',
                success: 'Profile updated successfully!',
                error: (err) => {
                    console.error('Update error:', err);
                    return 'Failed to update profile. Please check your input and try again.';
                }
            }
        ).finally(() => setIsSubmitting(false));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-primary-dark">Update Profile</h2>
                    <button onClick={onClose} className="text-text-light hover:text-text-dark">
                        <IoMdClose size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Picture Section */}
                    <div className="flex items-center space-x-4 mb-2">
                        <div className="relative">
                            {/* Profile Picture Preview */}
                            <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center overflow-hidden">
                                {formData.image ? (
                                    <img
                                        src={formData.image}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="w-8 h-8 text-primary" />
                                )}
                            </div>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                                }}
                                className="hidden"
                                id="fileInput"
                            />

                            {/* Upload Button */}
                            <label
                                htmlFor="fileInput"
                                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-primary-dark transition"
                            >
                                <FaCamera className="w-4 h-4" />
                            </label>
                        </div>

                        <div>
                            <h3 className="font-medium text-text-dark">Profile Picture</h3>
                            <p className="text-text-light text-sm flex items-center">
                                <FaInfoCircle className="w-3 h-3 mr-1" />
                                JPG, GIF, or PNG
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-text-light mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-primary-light rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-text-light mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            disabled
                            className="w-full p-2 border border-primary-light rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-text-light mb-1">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="0"
                            max="120"
                            className="w-full p-2 border border-primary-light rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-text-light mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border border-primary-light rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-text-light mb-1">Blood Group</label>
                        <input
                            type="text"
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            className="w-full p-2 border border-primary-light rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-text-light mb-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full p-2 border border-primary-light rounded-lg focus:outline-none focus:border-primary"
                        >
                            {Object.values(GENDER).map((gender) => (
                                <option key={gender} value={gender}>{gender}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary-semidark text-white py-2 rounded-lg transition-colors"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileModal;