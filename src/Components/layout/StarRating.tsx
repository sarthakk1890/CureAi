import React from 'react';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    className?: string;
    size?: 'sm' | 'lg' | 'xl' | '2xl' | '3xl';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5, className = '', size = "lg" }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

    return (
        <div className={`flex ${className}`}>
            {Array.from({ length: fullStars }, (_, index) => (
                <span key={index} className={`text-yellow-500 text-${size}`}>&#9733;</span>
            ))}
            {halfStar && <span className={`text-yellow-500 text-${size}`}>&#9734;</span>}
            {Array.from({ length: emptyStars }, (_, index) => (
                <span key={index} className={`text-gray-300 text-${size}`}>&#9733;</span>
            ))}
        </div>
    );
};

export default StarRating;