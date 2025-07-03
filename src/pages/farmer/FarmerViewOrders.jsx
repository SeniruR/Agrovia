import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FarmerViewOrders = () => {
    const [filters, setFilters] = useState({
        id: "",
        dateFrom: "",
        dateTo: "",
        status: "",
    });

    // Example Sri Lankan farm grains and vegetables orders
    const [orders] = useState([
        {
            id: "#CROP001",
            date: "2024-06-01 09:30:00",
            crop: "Red Rice",
            variety: "Suwandel",
            quantity: "100kg",
            billTo: "Nimal Perera",
            shipTo: "Colombo Market",
            subtotal: "Rs. 12,000.00",
            income: "Rs. 11,400.00",
            status: "Complete",
        },
        {
            id: "#CROP002",
            date: "2024-06-02 10:15:00",
            crop: "Green Beans",
            variety: "Local",
            quantity: "50kg",
            billTo: "Sunil Silva",
            shipTo: "Kandy Supermarket",
            subtotal: "Rs. 7,500.00",
            income: "Rs. 7,000.00",
            status: "Pending",
        },
        {
            id: "#CROP003",
            date: "2024-06-03 14:00:00",
            crop: "Big Onion",
            variety: "Jaffna",
            quantity: "200kg",
            billTo: "Ruwan Jayasuriya",
            shipTo: "Galle Retailers",
            subtotal: "Rs. 18,000.00",
            income: "Rs. 17,100.00",
            status: "Complete",
        },
        // Add more orders as needed...
    ]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const exportCSV = () => {
        alert("CSV export not yet implemented");
    };

    const navigate = useNavigate();

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen">
            {/* Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        name="id"
                        placeholder="Order ID"
                        value={filters.id}
                        onChange={handleFilterChange}
                        className="border border-green-200 bg-green-50 p-2 rounded focus:ring-2 focus:ring-green-300 text-gray-900"
                    />
                    <input
                        type="date"
                        name="dateFrom"
                        placeholder="Date From"
                        value={filters.dateFrom}
                        onChange={handleFilterChange}
                        className="border border-green-200 bg-green-50 p-2 rounded focus:ring-2 focus:ring-green-300 text-gray-900"
                    />
                    <input
                        type="date"
                        name="dateTo"
                        placeholder="DateTo"
                        value={filters.dateTo}
                        onChange={handleFilterChange}
                        className="border border-green-200 bg-green-50 p-2 rounded focus:ring-2 focus:ring-green-300 text-gray-900"
                    />
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="border border-green-200 bg-green-50 p-2 rounded focus:ring-2 focus:ring-green-300 text-gray-900"
                    >
                        <option value="">All Status</option>
                        <option value="Complete">Complete</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                        Filter
                    </button>
                    <button
                        onClick={exportCSV}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Order #</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Purchased On</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Crop</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Variety</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Quantity</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Bill to Name</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Ship to Name</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Subtotal</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Income</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Status</th>
                            <th className="p-3 text-gray-500 uppercase tracking-wider text-xs font-medium font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx) => (
                            <tr key={idx} className="border-t border-blue-100 hover:bg-white transition">
                                <td className="p-3 text-gray-900">{order.id}</td>
                                <td className="p-3 text-gray-500">{order.date}</td>
                                <td className="p-3 text-gray-900">{order.crop}</td>
                                <td className="p-3 text-gray-900">{order.variety}</td>
                                <td className="p-3 text-gray-900">{order.quantity}</td>
                                <td className="p-3 text-gray-500">{order.billTo}</td>
                                <td className="p-3 text-gray-500">{order.shipTo}</td>
                                <td className="p-3 text-gray-900">{order.subtotal}</td>
                                <td className="p-3 text-gray-900">{order.income}</td>
                                <td className="p-3">
                                    <span
                                        className={
                                            order.status === "Complete"
                                                ? "bg-green-100 text-gray-900 px-2 py-1 rounded-full text-xs font-medium"
                                                : "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium"
                                        }
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3 space-x-2 flex items-center">
                                    <button
                                        className="flex items-center gap-1 text-blue-600 hover:text-gray-500 uppercase tracking-wider text-xs font-medium transition"
                                        onClick={() => navigate("/farmervieworderdetails")}
                                    >
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                            <path
                                                d="M1.5 12S5.25 5.25 12 5.25 22.5 12 22.5 12 18.75 18.75 12 18.75 1.5 12 1.5 12Z"
                                                stroke="#2563eb"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                                stroke="#2563eb"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        View
                                    </button>
                                    {order.status === "Pending" && (
                                        <button className="flex items-center gap-1 text-green-600 hover:text-green-900 transition">
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                <path
                                                    d="M3 17V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v12"
                                                    stroke="#16a34a"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M16 17h2a2 2 0 0 0 2-2v-3.34a1 1 0 0 0-.21-.62l-2.13-2.84A1 1 0 0 0 16.87 8H16"
                                                    stroke="#16a34a"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <circle cx="7.5" cy="17.5" r="1.5" fill="#16a34a" />
                                                <circle cx="17.5" cy="17.5" r="1.5" fill="#16a34a" />
                                            </svg>
                                            Ship
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FarmerViewOrders;