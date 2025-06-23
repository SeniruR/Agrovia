import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [sentCode, setSentCode] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const sendCode = () => {
        if (!form.email) {
            setError("Please enter your email.");
            return;
        }
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        setSentCode(generatedCode);
        alert(`Verification code sent to ${form.email}: ${generatedCode}`);
        setStep(2);
    };

    const verifyCode = () => {
        if (form.code !== sentCode) {
            setError("Invalid verification code.");
            return;
        }
        setStep(3);
    };

    const resetPassword = () => {
        const { newPassword, confirmPassword } = form;
        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
            setError("Password must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 digit.");
            return;
        }
        alert("Password reset successfully!");
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
            <div className="p-10 rounded-2xl shadow-2xl w-[40%] max-w-sm flex flex-col items-center"
                style={{ border: '2px solid springgreen', borderRadius: '17px', padding: '30px', width: '-webkit-fill-available', maxWidth: '340px' }}>
                <h2 className="text-3xl font-extrabold mb-8 text-green-700 text-center">Reset Password</h2>
                <form onSubmit={(e) => { e.preventDefault(); step === 1 ? sendCode() : step === 2 ? verifyCode() : resetPassword(); }} className="w-full space-y-6">
                    {step === 1 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                            />
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Verification Code</label>
                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                            />
                        </div>
                    )}
                    {step === 3 && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                    style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                    style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                                />
                            </div>
                        </>
                    )}
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        className="accept-button w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                        style={{ marginTop: '10px' }}
                    >
                        {step === 1 ? "Send Code" : step === 2 ? "Verify Code" : "Reset Password"}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 mt-6">
                    Remembered your password?{" "}
                    <Link to="/login"><span className="text-green-700 font-semibold cursor-pointer hover:underline">
                        Log in
                    </span></Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
