import React from 'react';
import { useNavigate } from 'react-router-dom';
import Products from '../../static-data/storeData.json';
import ProductCard from '../layout/ProductCard';


const Store: React.FC = () => {
    const navigate = useNavigate();

    const handleCardClick = (index: number) => {
        navigate(`/store/${index}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-12">
            {/* Header Section */}
            <h1 className="text-6xl font-bold text-primary-dark mb-2 text-center">
                Welcome to Our Store
            </h1>
            <h3 className="text-lg text-primary text-center mb-8">
                Explore and choose from a wide range of premium equipment
            </h3>

            {/* Product Grid */}
            <div className="py-5 flex flex-wrap justify-center gap-8 lg:px-64">
                {Products.map((product, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(index)}
                        className="cursor-pointer transition-transform transform hover:scale-105"
                    >
                        {/* @ts-ignore */}
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Footer Section */}
            <footer className="mt-12 text-gray-500 text-sm text-center">
                &copy; {new Date().getFullYear()} Store Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default Store;
