import React from 'react';

interface Doctor {
    image: string;
    name: string;
    specialty: string;
    yearsOfExperience: number;
    specialties: string[];
}

const Card: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
    const specialtiesToShow = 2;
    const displayedSpecialties = doctor.specialties.slice(0, specialtiesToShow);
    const remainingSpecialtiesCount = doctor.specialties.length - specialtiesToShow;

    return (
        <div className="h-[50vh] rounded-lg overflow-hidden bg-white border border-gray-200 m-4">
            <div className='bg-primary-light m-3 rounded-lg flex align-center justify-center'>
                <img
                    className="w-auto h-56 object-cover"
                    src={doctor.image}
                    alt={`${doctor.name}'s picture`}
                />
            </div>
            <div className="px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <p className="text-sm text-gray-500">{doctor.yearsOfExperience} years of experience</p>
            </div>
            <div className="px-4 pb-4">
                <div className="flex flex-wrap">
                    {displayedSpecialties.map((specialty, index) => (
                        <span
                            key={index}
                            className="text-sm text-gray-600 bg-gray-100 rounded-full py-1 px-3 m-1"
                        >
                            {specialty}
                        </span>
                    ))}
                    {remainingSpecialtiesCount > 0 && (
                        <span className="text-sm text-gray-600 bg-gray-100 rounded-full py-1 px-3 m-1">
                            +{remainingSpecialtiesCount} more
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
