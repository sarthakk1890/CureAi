import React from "react";

type TestimonialCardProps = {
    name: string;
    designation: string;
    image: string;
    review: string;
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    name,
    designation,
    image,
    review,
}) => {
    return (
        <div className="relative bg-white flex flex-col w-[380px] h-[250px] rounded-xl p-6 shadow-lg transition-transform transform hover:scale-105 mb-8">
            {/* Profile Image */}
            <div className="h-[90px] w-[90px] absolute -top-10 left-1/2 transform -translate-x-1/2">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full border-4 border-white rounded-full shadow-md object-cover object-center"
                />
            </div>
            {/* Card Content */}
            <div className="mt-12">
                <p className="text-sm text-gray-800 mb-4">{review}</p>
                <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
                <h4 className="text-sm text-gray-500">{designation}</h4>
            </div>
            {/* Quote Icon */}
            <i className="fa fa-quote-left text-gray-300 text-5xl absolute bottom-6 right-6"></i>
        </div>
    );
};

export default TestimonialCard;
