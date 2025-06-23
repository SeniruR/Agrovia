import { useState } from "react";

const SupportForm = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        issueType: "",
        message: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const issueOptions = [
        "Account Problems",
        "Order Problems",
        "Report Someone",
        "Payment Issues",
        "Technical Error",
        "Other"
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, issueType, message } = form;
        if (!name || !email || !issueType || !message) {
            setError("Please fill in all fields.");
            return;
        }
        setSuccess("Your message has been sent. We'll get back to you soon!");
        setForm({ name: "", email: "", issueType: "", message: "" });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
            <div className="p-10 rounded-2xl shadow-2xl w-[40%] max-w-sm flex flex-col items-center"
                style={{ border: '2px solid springgreen', borderRadius: '17px', padding: '30px', width: '-webkit-fill-available', maxWidth: '340px' }}>
                <h2 className="text-3xl font-extrabold mb-8 text-green-700 text-center">Contact Support</h2>
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    {["name", "email"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                type={field === "email" ? "email" : "text"}
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Type</label>
                        <select
                            name="issueType"
                            value={form.issueType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                            style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                        >
                            <option value="">Select Issue</option>
                            {issueOptions.map((issue) => (
                                <option key={issue} value={issue}>{issue}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                            style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '8px 0', color: 'black' }}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    {success && <div className="text-green-600 text-sm text-center">{success}</div>}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                        style={{ marginTop: '10px' }}
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SupportForm;
