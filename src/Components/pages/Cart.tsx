import React, { useState } from "react";
// import { Trash, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";

type Product = {
    productName: string;
    features: string;
    rating: number;
    reviews: number;
    boughtRecently?: string | null;
    price: {
        currentPrice: number;
        originalPrice: number;
        discount: string;
    };
    delivery: {
        freeDeliveryDate: string;
    };
    availability: string;
    addToCart: boolean;
    image: string;
};

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([
        {
            product: {
                productName: "Gel Exercise Ball",
                features: "Finger Exercise Equipment, Stress Relief Ball",
                rating: 4.2,
                reviews: 138,
                boughtRecently: "1K+ bought in past month",
                price: {
                    currentPrice: 199,
                    originalPrice: 499,
                    discount: "60% off",
                },
                delivery: {
                    freeDeliveryDate: "Sat, 4 Jan",
                },
                availability: "In stock",
                addToCart: true,
                image: "https://m.media-amazon.com/images/I/31QCDWSIUkL._SX300_SY300_QL70_FMwebp_.jpg",
            },
            quantity: 1,
        },
    ]);

    const [address, setAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        pincode: "",
        state: "",
    });

    const handleRemoveItem = (index: number) => {
        setCartItems(cartItems.filter((_, i) => i !== index));
    };

    const handleIncreaseQuantity = (index: number) => {
        const updatedItems = [...cartItems];
        updatedItems[index].quantity += 1;
        setCartItems(updatedItems);
    };

    const handleDecreaseQuantity = (index: number) => {
        const updatedItems = [...cartItems];
        if (updatedItems[index].quantity > 1) {
            updatedItems[index].quantity -= 1;
            setCartItems(updatedItems);
        }
    };

    const handleProceedToPayment = () => {
        const { addressLine1, city, pincode, state } = address;
        if (!addressLine1 || !city || !pincode || !state) {
            toast.error("Please fill in all address fields before proceeding.");
            return;
        }
        toast("Proceeding to payment...");
    };

    const calculateSubtotal = () => {
        return cartItems.reduce(
            (acc, item) => acc + item.product.price.currentPrice * item.quantity,
            0
        );
    };

    return (
        <>
            {cartItems.length === 0 ? (
                <div className="max-w-6xl mx-auto p-6 min-h-[90vh] flex items-center justify-center">
                    <div className="text-center p-6 rounded-lg">
                        <h1 className="text-2xl font-bold text-primary-dark">Your Cart is Empty</h1>
                        <p className="mt-4 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
                        <button
                            onClick={() => navigate("/store")}
                            className="mt-6 bg-primary-semidark text-white py-3 px-6 rounded-md hover:bg-primary-dark transition"
                        >
                            Go to Shop
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto p-6 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-16 py-16">
                    {/* Left Side: Cart Items and Order Total */}
                    <div>
                        <h1 className="text-2xl text-primary-dark font-bold my-4">Your Cart</h1>
                        <div className="space-y-6">
                            {cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-white shadow-md rounded-lg p-4"
                                >
                                    {/* Product Image */}
                                    <img
                                        src={item.product.image}
                                        alt={item.product.productName}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />

                                    {/* Product Details */}
                                    <div className="ml-4 flex-1">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {item.product.productName}
                                        </h2>
                                        <p className="text-sm text-gray-600">{item.product.features}</p>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 space-x-2">
                                            <span>₹{item.product.price.currentPrice}</span>
                                            <span className="line-through">
                                                ₹{item.product.price.originalPrice}
                                            </span>
                                            <span className="text-green-600">
                                                {item.product.price.discount}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Free delivery by {item.product.delivery.freeDeliveryDate}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleDecreaseQuantity(index)}
                                            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                        >
                                            <BiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncreaseQuantity(index)}
                                            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                        >
                                            <BiPlus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveItem(index)}
                                        className="ml-4 text-gray-500 hover:text-red-600"
                                    >
                                        <BiTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Total */}
                        <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
                            <h2 className="text-lg font-semibold">Order Summary</h2>
                            <div className="mt-4 flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>₹{calculateSubtotal()}</span>
                            </div>
                            <button
                                onClick={handleProceedToPayment}
                                className="w-full mt-4 bg-primary-semidark text-white py-3 rounded-md hover:bg-primary-dark transition"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Address Entry */}
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-primary-semidark mb-2">Delivery Address</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Address Line 1"
                                value={address.addressLine1}
                                onChange={(e) =>
                                    setAddress({ ...address, addressLine1: e.target.value })
                                }
                                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-color"
                            />
                            <input
                                type="text"
                                placeholder="Address Line 2"
                                value={address.addressLine2}
                                onChange={(e) =>
                                    setAddress({ ...address, addressLine2: e.target.value })
                                }
                                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-color"
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-color"
                            />
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={address.pincode}
                                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-color"
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={address.state}
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-color"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Cart;
