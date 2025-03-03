import { FaPills } from 'react-icons/fa';

const Orders = () => {
    const orders = [
        {
            id: 1,
            date: "Feb 5, 2025",
            items: ["Paracetamol 500mg", "Vitamin C 1000mg"],
            total: 45.99,
            status: "Delivered",
            prescription: "prescription-001.pdf"
        },
        {
            id: 2,
            date: "Feb 1, 2025",
            items: ["Blood Pressure Monitor", "Digital Thermometer"],
            total: 129.99,
            status: "Processing",
            prescription: "prescription-002.pdf"
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="border border-primary-light rounded-lg p-4 hover:bg-primary-light transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-primary-dark">Order #{order.id}</h3>
                                    <p className="text-text-light">{order.date}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'
                                    } text-white`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center text-text-light">
                                    <FaPills className="w-4 h-4 mr-2 text-primary" />
                                    {order.items.join(", ")}
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="font-medium text-primary-dark">
                                        Total: ${order.total}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders