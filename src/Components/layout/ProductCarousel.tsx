import React from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard'; // Import the ProductCard component
// import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

interface Product {
    productName: string;
    features: string;
    rating: number;
    reviews: number;
    boughtRecently: string;
    price: {
        currentPrice: number;
        originalPrice: number;
        discount: string;
    };
    delivery: {
        freeDeliveryDate: string;
        fastestDeliveryDate?: string; // Optional
    };
    availability: string;
    addToCart: boolean;
    image: string;
}

interface ProductCarouselProps {
    products: Product[];
}

// const CustomArrow: React.FC<{ direction: 'left' | 'right'; onClick?: () => void }> = ({
//     direction,
//     onClick,
// }) => {
//     return (
//         <button
//             className={`custom-arrow ${direction}`}
//             onClick={onClick}
//             aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
//         >
//             {direction === 'left' ? (
//                 <BiChevronLeft className="arrow-icon" />
//             ) : (
//                 <BiChevronRight className="arrow-icon" />
//             )}
//         </button>
//     );
// };

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        centerMode: false, // Disable center mode for proper scrolling
        autoplay: true, // Enable if needed
        autoplaySpeed: 3000,
        slidesToShow: 3,
        slidesToScroll: 3, // Scroll three cards at once
        // prevArrow: <CustomArrow direction="left" />,
        // nextArrow: <CustomArrow direction="right" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2, // Match slides to scroll with slides to show
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1, // Match slides to scroll with slides to show
                },
            },
        ],
    };


    return (
        <div className="product-carousel overflow-none">
            <Slider {...settings}>
                {products.map((product, index) => (
                    <div
                        key={index}
                        className="pl-4 cursor-pointer mb-8"
                        onClick={() => navigate(`/store/${index}`)}
                    >
                        <ProductCard product={product} width='auto' />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductCarousel;
