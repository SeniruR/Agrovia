import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, Leaf } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) {
            setError("Please fill in all fields.");
            return;
        }
        
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password })
            });
            
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Login failed');
            }
            
            const data = await res.json();
            const user = data?.data?.user;
            const token = data?.data?.token;

            // Check if user is disabled (is_active === 0)
            if (user && user.is_active === 0) {
                try {
                    const reasonRes = await fetch(`http://localhost:5000/api/v1/auth/disable-reason/${user.id}`);
                    if (reasonRes.ok) {
                        const reasonData = await reasonRes.json();
                        const reason = reasonData?.case_name || reasonData?.reason || 'Your account is disabled.';
                        setError(`Your account is disabled. Reason: ${reason}`);
                    } else {
                        setError('Your account is disabled. Please contact support.');
                    }
                } catch (err) {
                    setError('Your account is disabled. Please contact support.');
                }
                setIsLoading(false);
                return;
            }

            if (data.success && user && token) {
                login(user, token);
                if (user && user.id) {
                    localStorage.setItem('userId', user.id);
                }
                
                if (user.role === 'farmer') {
                    navigate('/dashboard/farmer');
                    window.location.reload();
                } else {
                    navigate('/');
                    window.location.reload();
                }
            } else if (data.success && user) {
                localStorage.setItem('user', JSON.stringify(user));
                if (user && user.id) {
                    localStorage.setItem('userId', user.id);
                }
                setError('Login succeeded but no token received. Please contact support.');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-25 to-green-50 flex items-center justify-center p-2 sm:p-4">
            {/* Main Container */}
            <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-green-100">
                <div className="flex flex-col md:flex-row">
                    {/* Left Panel - Green themed promotional content */}
                    <div className="flex-1 relative overflow-hidden min-h-[260px] md:min-h-[520px]">
                        <div 
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: 'url("https://i.pinimg.com/736x/4b/5c/43/4b5c438572f0f9c16cad9d245ae5905e.jpg")'
                            }} 
                        >
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                        
                        {/* Content Overlay */}
                        <div className="relative z-15 flex flex-col justify-center h-full px-6 py-10 sm:px-10 sm:py-14 text-white">
                            <div className="max-w-sm mx-auto">
                                {/* Logo */}
                                <div className="flex items-center mb-8">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                                        <Leaf className="h-6 w-6 text-green-600" />
                                    </div>
                                    <span className="text-2xl font-bold">Agrovia</span>
                                </div>
                                {/* Main Message */}
                                <h2 className="text-green-50 color-white text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                                    New to Agrovia?
                                </h2>
                                <p className="text-green-50 mb-8 text-base sm:text-lg leading-relaxed">
                                    Don't have an account?
                                </p>
                                {/* CTA Button */}
                                <Link to="/signup" className="block w-full">
                                    <button className="bg-white text-green-600 px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg w-full">
                                        CREATE ACCOUNT
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Login Form */}
                    <div className="flex-1 bg-white p-6 sm:p-10 flex items-center justify-center">
                        <div className="w-full max-w-sm">
                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Welcome Back</h2>
                                <p className="text-green-600 text-base sm:text-lg">Sign in to your account</p>
                            </div>
                            {/* Form */}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-green-700 mb-2">Email</label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 bg-green-50/50 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-green-900 placeholder-green-400"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-green-700 mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            required
                                            value={form.password}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 bg-green-50/50 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-green-900 placeholder-green-400 pr-12"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-green-500 hover:text-green-600 transition-colors" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-green-500 hover:text-green-600 transition-colors" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {/* Forgot Password */}
                                <div className="text-right">
                                    <Link to="/forgotpassword" className="text-sm text-green-600 hover:text-green-700 transition-colors">Forgot your password?</Link>
                                </div>
                                {/* Error Message */}
                                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                                            SIGNING IN...
                                        </div>
                                    ) : (
                                        'SIGN IN'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;