import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("Please fill in all fields.");
            return;
        }
        // Backend login request
        fetch('http://localhost:5000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: form.email, password: form.password }),
        })
        .then(async (res) => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Login failed');
            }
            return res.json();
        })
        .then((data) => {
            // The backend returns user as data.data.user
            const user = data?.data?.user;
            if (data.success && user) {
                localStorage.setItem('user', JSON.stringify(user));
                // Redirect based on user role
                if (user.role === 'farmer') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError(data.message || 'Invalid credentials');
            }
        })
        .catch((err) => {
            setError(err.message || 'Login failed');
        });
    };

    return (
        <div className="flex items-center justify-center" style={{height:'calc(100vh - 80px)'}}>
            <div className="p-10 rounded-2xl shadow-2xl w-[40%] max-w-sm flex flex-col items-center" style={{ border: '2px solid springgreen', borderRadius: '17px', padding: '30px' , width:'-webkit-fill-available', maxWidth:'340px'}}>
                <h2 className="text-3xl mb-8 text-center">Welcome</h2>
                <form onSubmit={handleSubmit} className="w-full space-y-6">
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
                            style={{backgroundColor:'white',padding: '10px',width: '-webkit-fill-available',borderRadius: '10px',margin: '8px 0', color: 'black'}}
                        />
                    </div>
                    <div style={{marginTop:'10px'}}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                            style={{backgroundColor:'white',padding: '10px',width: '-webkit-fill-available',borderRadius: '10px',margin: '8px 0',color:'black'}}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        className="accept-button w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition" style={{marginTop:'10px'}}
                    >
                        Log In
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup"><span className="text-green-700 font-semibold cursor-pointer hover:underline">
                        Sign up
                    </span></Link>
                    <br/>
                    Forgot your Password?{" "}
                    <Link to="/forgotpassword"><span className="text-green-700 font-semibold cursor-pointer hover:underline">
                        Reset Password
                    </span></Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
