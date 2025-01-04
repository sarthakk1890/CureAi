import React from 'react';
import Slider from 'react-slick';
import Card from './Card'; // Assuming the Card component is in the same directory.
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

interface Specialist {
    image: string;
    name: string;
    specialty: string;
    yearsOfExperience: number;
    specialties: string[];
}

interface SpecialistsCarouselProps {
    specialists: Specialist[];
}


const CustomArrow: React.FC<{ direction: 'left' | 'right'; onClick?: () => void }> = ({
    direction,
    onClick,
}) => {
    return (
        <button
            className={`custom-arrow ${direction}`}
            onClick={onClick}
            aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
        >
            {direction === 'left' ? (
                <BiChevronLeft className="arrow-icon" />
            ) : (
                <BiChevronRight className="arrow-icon" />
            )}
        </button>
    );
};

const SpecialistsCarousel: React.FC<SpecialistsCarouselProps> = ({ specialists }) => {

    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        centerMode: true,
        centerPadding: "0px",
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: <CustomArrow direction="left" />,
        nextArrow: <CustomArrow direction="right" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="specialists-carousel">
            <Slider {...settings}>
                {specialists.map((specialist, index) => (
                    <div key={index} className='pl-4 flex justify-center align-center cursor-pointer' onClick={() => navigate(`/doctor/${index + 1}`)}>
                        <Card doctor={specialist} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SpecialistsCarousel;
