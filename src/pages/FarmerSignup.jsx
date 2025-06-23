import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        location: "",
        NIC: "",
        address: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleNext = (e) => {
        e.preventDefault();
        const { name, NIC, address, location } = form;
        if (!name || !NIC || !address || !location) {
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password, confirmPassword } = form;
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
        navigate("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
            <div className="p-10 rounded-2xl shadow-2xl w-[40%] max-w-sm flex flex-col items-center" style={{ border: '2px solid springgreen', borderRadius: '17px', padding: '30px', width: '-webkit-fill-available', maxWidth: '340px', marginTop:'30px' }}>
                <h2 className="text-3xl font-extrabold mb-8 text-green-700 text-center">Farmer Sign Up</h2>
                <form onSubmit={step === 1 ? handleNext : handleSubmit} className="w-full space-y-6">
                    {step === 1 ? (
                        <>
                            {["name", "NIC", "address"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={form[field]}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                        style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                                <select
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                    style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                                >
                                    <option value="">Select District</option>
                                    {districts.map((district) => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : (
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
                                        style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                        style={{ marginTop: '10px' }}
                    >
                        {step === 1 ? "Next" : "Sign Up"}
                    </button>
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
