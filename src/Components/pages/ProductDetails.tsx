import React from 'react';
import { useParams } from 'react-router-dom';
import Products from '../../static-data/storeData.json';
import toast from 'react-hot-toast';
import { CiDeliveryTruck, CiHeart, CiShoppingCart } from 'react-icons/ci';
import StarRating from '../layout/StarRating';

interface ProductDetails {
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
        fastestDeliveryDate: string;
    };
    availability: string;
    addToCart: boolean;
    image: string;
}

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    //@ts-ignore
    const product: ProductDetails = Products[id] as ProductDetails;

    const addedToCart = () => toast.success('Added to cart');
    const addedToWishlist = () => toast('Added your wishlist', { icon: '❤️' });

    return (
        <div className="max-w-7xl mx-auto p-6 my-12 pt-[5vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image Section */}
                <div className="space-y-4 mr-6">
                    <div className="bg-white rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                            <img
                                src={product.image}
                                alt={product.productName}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {product.productName}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <StarRating rating={product.rating} size="2xl" />
                                <span className="ml-2 text-sm text-gray-600">
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {product.boughtRecently}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-b py-4">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold">₹{product.price.currentPrice}</span>
                            <span className="text-lg text-gray-500 line-through">
                                ₹{product.price.originalPrice}
                            </span>
                            <span className="text-green-600 font-semibold">
                                {product.price.discount}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Key Features</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            {product.features.split(', ').map((feature, index) => (
                                <li key={index} className="text-gray-600">
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                            <CiDeliveryTruck className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="text-gray-800">
                                    Free delivery by {product.delivery.freeDeliveryDate}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Fastest delivery by {product.delivery.fastestDeliveryDate}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-green-600">
                            <div className="w-2 h-2 bg-green-600 rounded-full" />
                            <span>{product.availability}</span>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button onClick={addedToCart} className="flex-1 bg-primary-semidark text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center">
                            <CiShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                        </button>
                        <button onClick={addedToWishlist} className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <CiHeart className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
