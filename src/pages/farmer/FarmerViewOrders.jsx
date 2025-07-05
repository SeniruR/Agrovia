import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FarmerViewOrders = () => {
    const [filters, setFilters] = useState({
        id: "",
        dateFrom: "",
        dateTo: "",
        status: "",
    });

    const [orders] = useState([
        {
            id: "#CROP001",
            date: "2024-06-01 09:30:00",
            crop: "Tomato, Cucumber, Carrot",
            billTo: "Sunil Perera",
            shipTo: "No. 45, Farm Road, Kurunegala, Sri Lanka",
            subtotal: 20500,
            total: 21500,
            status: "Delivered",
        },
        {
            id: "#CROP002",
            date: "2024-06-02 10:15:00",
            crop: "Green Beans",
            billTo: "Nimal Silva",
            shipTo: "Kandy Supermarket",
            subtotal: 7500,
            total: 8000,
            status: "Processing",
        },
        {
            id: "#CROP003",
            date: "2024-06-03 14:00:00",
            crop: "Big Onion",
            billTo: "Ruwan Jayasuriya",
            shipTo: "Galle Retailers",
            subtotal: 18000,
            total: 18500,
            status: "Delivered",
        },
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-10 px-4 flex flex-col items-center">
            <div className="w-full max-w-7xl">
                <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">My Orders</h1>
                {/* Filter Section */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            name="id"
                            placeholder="Order ID"
                            value={filters.id}
                            onChange={handleFilterChange}
                            className="border border-green-200 bg-green-50 p-2 rounded-lg focus:ring-2 focus:ring-green-300 text-gray-900"
                        />
                        <input
                            type="date"
                            name="dateFrom"
                            placeholder="Date From"
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                            className="border border-green-200 bg-green-50 p-2 rounded-lg focus:ring-2 focus:ring-green-300 text-gray-900"
                        />
                        <input
                            type="date"
                            name="dateTo"
                            placeholder="Date To"
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                            className="border border-green-200 bg-green-50 p-2 rounded-lg focus:ring-2 focus:ring-green-300 text-gray-900"
                        />
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="border border-green-200 bg-green-50 p-2 rounded-lg focus:ring-2 focus:ring-green-300 text-gray-900"
                        >
                            <option value="">All Status</option>
                            <option value="Complete">Delivered</option>
                            <option value="Pending">Processing</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold">
                            Filter
                        </button>
                        <button
                            onClick={exportCSV}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition font-semibold"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-x-auto">
                    <table className="min-w-full divide-y divide-green-100">
                        <thead className="bg-green-50">
                            <tr>
                                <th className="p-4 text-green-700 uppercase tracking-wider text-xs font-bold">Order #</th>
                                <th className="p-4 text-green-700 uppercase tracking-wider text-xs font-bold">Purchased On</th>
                                <th className="p-4 text-green-700 uppercase tracking-wider text-xs font-bold">Crop</th>
                                <th className="p-4 text-green-700 uppercase tracking-wider text-xs font-bold">Bill to Name</th>
                                <th className="p-4 text-green-700 uppercase tracking-wider text-xs font-bold">Ship to Name</th>
                                <th className="p-4 text-green-700 uppercase tracking-wider text-xs font-bold">Subtotal</th>
                                <th className="p-4 text-green-700 uppercase tracking-wider text-xs font-bold">Total</th>
                                <th className="p-4 text-green-700 uppercase tracking-wider text-xs font-bold">Status</th>
                                <th className="p-4 text-green-700 uppercase tracking-wider text-xs font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, idx) => (
                                <tr key={idx} className="border-t border-green-100 hover:bg-green-50 transition">
                                    <td className="p-4 text-gray-900 font-semibold">{order.id}</td>
                                    <td className="p-4 text-gray-500">{order.date}</td>
                                    <td className="p-4 text-gray-900">{order.crop}</td>
                                    <td className="p-4 text-gray-500">{order.billTo}</td>
                                    <td className="p-4 text-gray-500">{order.shipTo}</td>
                                    <td className="p-4 text-gray-900">Rs. {order.subtotal.toLocaleString()}</td>
                                    <td className="p-4 text-gray-900">Rs. {order.total.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span
                                            className={
                                                order.status === "Complete"
                                                    ? "bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold"
                                                    : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold"
                                            }
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center gap-2">
                                        <button
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 uppercase tracking-wider text-xs font-bold transition"
                                            onClick={() => navigate("/farmervieworderdetails", { state: { order } })}
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
        </div>
    );
};

export default FarmerViewOrders;