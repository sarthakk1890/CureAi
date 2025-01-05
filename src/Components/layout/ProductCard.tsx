import React from "react";
import StarRating from "./StarRating";

type Product = {
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
        fastestDeliveryDate?: string; // Make it optional
    };
    availability: string;
    addToCart: boolean;
    image: string;
};

type ProductCardProps = {
    product: Product;
    width: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, width }) => {

    return (
        <div className="bg-white overflow-hidden flex flex-col card-height"
            style={{ width }}
        >
            {/* Image Section */}
            <div className="h-48 flex items-center justify-center bg-gray-50">
                <img
                    className="w-auto h-full object-cover"
                    src={product.image}
                    alt={product.productName}
                />
            </div>

            {/* Details Section */}
            <div className="p-4 flex flex-col flex-grow border border-gray-200 border-t-0 rounded-b-lg">
                <h2 className="text-base font-medium text-gray-800">{product.productName}</h2>
                <div className="flex items-center mt-2">
                    <StarRating rating={product.rating} size="lg" />
                    <span className="text-gray-800 ml-2 text-sm">{product.rating}</span>
                    <span className="text-gray-600 ml-2 text-xs">({product.reviews} reviews)</span>
                </div>
                <div className="mt-3">
                    <span className="text-xl font-bold text-green-600">₹{product.price.currentPrice}</span>
                    <span className="text-xs line-through text-gray-500 ml-2">
                        ₹{product.price.originalPrice}
                    </span>
                    <span className="text-xs text-red-500 ml-2">{product.price.discount}</span>
                </div>

                {/* Button Section */}
                <button
                    className={`mt-auto py-2 w-auto text-sm text-white font-medium rounded-md ${product.addToCart ? "bg-primary-semidark hover:bg-primary-dark" : "bg-gray-400 cursor-not-allowed"
                        }`}
                    disabled={!product.addToCart}
                >
                    {product.addToCart ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
