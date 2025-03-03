import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCamera, FaUser, FaStethoscope, FaInfoCircle, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { MdLocalPhone, MdAttachMoney } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUpdateDoctorProfileMutation } from '../../../redux/api/userAPI';
import { setUser } from '../../../redux/reducers/userReducer';

const EditProfilePage: React.FC = () => {
    const doctorDetails = useSelector((state: any) => state.user.user);

    const dispatch = useDispatch();
    const [updateDoctorProfile] = useUpdateDoctorProfileMutation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        about: '',
        image: '',
        institute: '',
        title: '',
        experience: 0,
        cost_per_meeting: 0
    });

    useEffect(() => {
        if (doctorDetails) {
            setFormData({
                name: doctorDetails.name || '',
                email: doctorDetails.email || '',
                phone: doctorDetails.phone || '',
                specialization: doctorDetails.expertise?.join(', ') || '',
                about: doctorDetails.about || '',
                image: doctorDetails.image || '',
                institute: doctorDetails.institute || '',
                title: doctorDetails.title || '',
                experience: doctorDetails.experience || 0,
                cost_per_meeting: doctorDetails.cost_per_meeting || 0
            });
        }
    }, [doctorDetails]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'experience' || name === 'cost_per_meeting' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedProfile = {
            ...doctorDetails,
            ...formData,
            expertise: formData.specialization.split(',').map(s => s.trim()),
        };

        try {
            toast.promise(
                updateDoctorProfile(updatedProfile).unwrap().then((response) => {
                    dispatch(setUser(response.data));
                    return response; // Ensure the success toast gets triggered
                }),
                {
                    loading: "Updating profile...",
                    success: "Profile updated successfully!",
                    error: "Failed to update profile. Please try again."
                }
            );
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('An error occurred while updating the profile.');
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "user_profile_pics");

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
                    setFormData((prev) => ({ ...prev, image: response.data.secure_url }));
                }
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-2xl font-bold text-text-dark">Edit Profile</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center overflow-hidden">
                            {formData.image ? (
                                <img src={formData.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <FaUser className="w-8 h-8 text-primary" />
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                            }}
                            className="hidden"
                            id="fileInput"
                        />

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
                            <FaInfoCircle className="w-4 h-4 mr-2" />
                            JPG, GIF, or PNG. Max size of 800K
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: "name", label: "Name", icon: <FaUser /> },
                            { name: "phone", label: "Phone Number", icon: <MdLocalPhone /> },
                            { name: "specialization", label: "Specialization", icon: <FaStethoscope /> },
                            { name: "institute", label: "Institute", icon: <FaBuilding /> },
                            { name: "title", label: "Title", icon: <FaBriefcase /> },
                            { name: "experience", label: "Experience (Years)", icon: <FaInfoCircle /> },
                            { name: "cost_per_meeting", label: "Cost Per Meeting ($)", icon: <MdAttachMoney /> }
                        ].map((field) => (
                            <div className="relative" key={field.name}>
                                <label className="block text-sm font-medium text-text-dark mb-1">
                                    {field.label}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {field.icon}
                                    </div>
                                    <input
                                        type={field.name === 'experience' || field.name === 'cost_per_meeting' ? 'number' : 'text'}
                                        name={field.name}
                                        value={formData[field.name as keyof typeof formData]}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            disabled
                            className="w-full pl-10 p-2 border rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">
                            About
                        </label>
                        <textarea
                            name="about"
                            rows={4}
                            value={formData.about}
                            onChange={handleInputChange}
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
