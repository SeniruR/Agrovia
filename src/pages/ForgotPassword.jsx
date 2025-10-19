import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    const [success, setSuccess] = useState("");
    const [deliveryHint, setDeliveryHint] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const requestCode = async () => {
        if (!form.email) {
            throw new Error("Please enter your email address.");
        }

        const res = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.success === false) {
            throw new Error(data.message || "We couldn't send the verification code. Please try again.");
        }

        setSuccess("If your email is registered, we've sent a verification code.");
        setDeliveryHint(() => {
            if (data.devCode) {
                return `Development code: ${data.devCode}`;
            }
            if (data.emailDelivery === "failed") {
                return "We couldn't send the email automatically. Please check your spam folder or contact support.";
            }
            return "";
        });
        setStep(2);
    };

    const verifyCode = async () => {
        if (!form.code || form.code.length !== 6) {
            throw new Error("Please enter the 6-digit verification code.");
        }

        const res = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email, code: form.code })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.success === false) {
            throw new Error(data.message || "Verification code is invalid or has expired.");
        }

        if (!data.resetToken) {
            throw new Error("We could not create a reset session. Please request a new code.");
        }

        setResetToken(data.resetToken);
        setSuccess("Code verified. You can now set a new password.");
        setDeliveryHint("");
        setStep(3);
    };

    const submitNewPassword = async () => {
        const { newPassword, confirmPassword } = form;
        if (!newPassword || !confirmPassword) {
            throw new Error("Please enter and confirm your new password.");
        }
        if (newPassword !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
            throw new Error("Password must be at least 8 characters and include uppercase, lowercase, and a digit.");
        }
        if (!resetToken) {
            throw new Error("Reset session has expired. Please request a new code.");
        }

        const res = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password/reset`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: form.email,
                resetToken,
                password: newPassword
            })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.success === false) {
            throw new Error(data.message || "We couldn't reset your password. Please try again.");
        }

        setSuccess("Password reset successfully! Redirecting you to the login page...");
        setTimeout(() => navigate("/login"), 2200);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        if (step === 1) {
            setDeliveryHint("");
        }

        setIsLoading(true);
        try {
            if (step === 1) {
                await requestCode();
            } else if (step === 2) {
                await verifyCode();
            } else {
                await submitNewPassword();
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const buttonLabel = step === 1 ? "Send Code" : step === 2 ? "Verify Code" : "Reset Password";
    const stepDescription = {
        1: "Enter the email you use for Agrovia. We'll send a verification code if the account exists.",
        2: "Check your email and enter the 6-digit verification code.",
        3: "Create a strong new password for your account."
    }[step];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-3 py-6">
            <div className="w-full max-w-xl bg-white/90 backdrop-blur-xl border border-green-100 shadow-2xl rounded-3xl overflow-hidden">
                <div className="px-6 sm:px-10 py-10">
                    <h1 className="text-3xl font-bold text-green-800 text-center">Reset your password</h1>
                    <p className="mt-2 text-center text-green-600">Step {step} of 3</p>
                    <p className="mt-4 text-sm text-center text-gray-600">{stepDescription}</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {step === 1 && (
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-green-700 mb-2">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    required
                                    className="w-full px-4 py-3 bg-green-50/60 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-400"
                                    placeholder="you@example.com"
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <label htmlFor="code" className="block text-sm font-semibold text-green-700 mb-2">Verification code</label>
                                <input
                                    id="code"
                                    type="text"
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                    inputMode="numeric"
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    required
                                    className="w-full px-4 py-3 bg-green-50/60 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-400 tracking-widest text-center"
                                    placeholder="0 0 0 0 0 0"
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-semibold text-green-700 mb-2">New password</label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                        className="w-full px-4 py-3 bg-green-50/60 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-400"
                                        placeholder="Enter a strong password"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Use at least 8 characters with upper & lower case letters and a number.</p>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-green-700 mb-2">Confirm password</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                        className="w-full px-4 py-3 bg-green-50/60 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-400"
                                        placeholder="Re-enter your password"
                                    />
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                        )}
                        {success && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
                        )}
                        {deliveryHint && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">{deliveryHint}</div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 ${isLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 hover:shadow-xl"}`}
                        >
                            {isLoading ? "Please wait..." : buttonLabel}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Remembered your password?{" "}
                        <Link to="/login" className="text-green-700 font-semibold hover:underline">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
