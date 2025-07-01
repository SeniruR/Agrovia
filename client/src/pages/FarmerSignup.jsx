import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
    "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
    "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
    "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
    "Trincomalee", "Vavuniya"
];

const validateNIC = (nic) => {
    if (/^\d{4}\d{8}$/.test(nic)) return true;
    if (/^\d{2}\d{7}[VvXx]$/.test(nic)) return true;
    return false;
};

const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

const FarmerSignup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        location: "",
        NIC: "",
        address: ""
    });
    const [error, setError] = useState("");

    const [selectedOrgId, setSelectedOrgId] = useState("");

    const organizations = [
        {
            id: 1,
            name: "Green Growers Association",
            contact: "Mr. Sunil Perera",
            phone: "077-1234567",
            address: "123 Green Lane, Kandy"
        },
        {
            id: 2,
            name: "Agro Farmers Union",
            contact: "Ms. Nadeesha Fernando",
            phone: "071-9876543",
            address: "45 Farm Road, Anuradhapura"
        },
        {
            id: 3,
            name: "Organic Roots Collective",
            contact: "Dr. Ruwan Jayasuriya",
            phone: "075-4567890",
            address: "78 Organic Street, Galle"
        }
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            const { firstName,lastName, NIC, address, location } = form;
            if (!firstName || !lastName || !NIC || !address || !location) {
                setError("Please fill in all fields.");
                return;
            }
            if (address.length < 10) {
                setError("Address must be at least 10 characters long.");
                return;
            }
            if (!validateNIC(NIC)) {
                setError("Invalid NIC format.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!selectedOrgId) {
                setError("Please select an organization.");
                return;
            }
            setStep(3);
        }
    };

    const handleBack = () => {
    if (step > 1) {
        setStep(step - 1);
    }
    };

    const handleCancel = () => {
    navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, confirmPassword, firstName, lastName, NIC, address, location } = form;

        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 digit.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:3001/signup', {
                firstName,
                lastName,
                NIC,
                address,
                location,
                email,
                password,
                organizationId: selectedOrgId
            });

            if (res.data.message === 'Signup successful') {
                navigate('/login');
            } else if (res.data.message === 'Email already exists') {
                setError('An account with this email already exists.');
            } else {
                setError(res.data.message || 'Signup failed');
            }
        } catch (err) {
            if (err.response?.data?.message === 'Email already exists') {
                setError('An account with this email already exists.');
            } else {
                setError(err.response?.data?.message || 'Server error');
            }
        }
    };

    const formatLabel = (text) => {
        if (text === text.toUpperCase()) return text;
        return text.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };



    return (
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 80px)' }}>
            <div className="p-10 rounded-2xl shadow-2xl w-[40%] max-w-sm flex flex-col items-center" style={{ border: '2px solid springgreen', borderRadius: '17px', padding: '30px', width: '-webkit-fill-available', marginTop:'30px' }}>
                <h2 className="text-3xl mb-8 text-green-700 text-center mb-[10px]">Farmer Sign Up</h2>
                <form onSubmit={step < 3 ? handleNext : handleSubmit} className="w-full space-y-6">
                    {step === 1 && (
                        <>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                {["firstName", "lastName", "NIC", "address"].map((field) => (
                                    <div key={field} style={{ flex: '1 1 calc(50% - 10px)', marginTop: '10px' }}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        {formatLabel(field)}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={form[field]}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                        style={{
                                        backgroundColor: 'white',
                                        padding: '10px',
                                        width: '100%',
                                        borderRadius: '10px',
                                        margin: '4px 0',
                                        color: 'black',
                                        }}
                                    />
                                    </div>
                                ))}
                                </div>

                                <div style={{ marginTop: '10px' }}>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                                <select
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                    style={{
                                    backgroundColor: 'white',
                                    padding: '10px',
                                    width: '100%',
                                    borderRadius: '10px',
                                    margin: '4px 0',
                                    color: 'black',
                                    }}
                                >
                                    <option value="">Select District</option>
                                    {districts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                    ))}
                                </select>
                                </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Organization</label>
                                <select
                                    value={selectedOrgId}
                                    onChange={(e) => setSelectedOrgId(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                    style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px', margin: '4px 0', color: 'black' }}
                                >
                                    <option value="">Choose an organization</option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedOrgId && (
                                <div className="mt-4 p-4 border border-green-300 rounded-lg bg-green-50 text-sm text-gray-800">
                                    <p><strong>Name:</strong> {organizations.find(org => org.id === parseInt(selectedOrgId)).name}</p>
                                    <p><strong>Contact:</strong> {organizations.find(org => org.id === parseInt(selectedOrgId)).contact} ({organizations.find(org => org.id === parseInt(selectedOrgId)).phone})</p>
                                    <p><strong>Address:</strong> {organizations.find(org => org.id === parseInt(selectedOrgId)).address}</p>
                                </div>
                            )}
                            <p className="text-xs text-gray-600 mt-4">
                                Your account will be activated after the organization approves your membership.
                            </p>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            {["email", "password", "confirmPassword"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        {field === "confirmPassword" ? "Re-enter Password" : field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    <input
                                        type={field === "email" ? "email" : "password"}
                                        name={field}
                                        value={form[field]}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                        style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <div className="flex justify-between space-x-4">
                    <button
                        type="button"
                        onClick={step === 1 ? handleCancel : handleBack}
                        className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                        style={{ marginTop: '10px' }}
                    >
                        {step === 1 ? "Cancel" : "Back"}
                    </button>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                        style={{ marginTop: '10px' }}
                    >
                        {step < 3 ? "Next" : "Sign Up"}
                    </button>
                    </div>

                </form>
                <p className="text-sm text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <span className="text-green-700 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/login")}>
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
};

export default FarmerSignup;
