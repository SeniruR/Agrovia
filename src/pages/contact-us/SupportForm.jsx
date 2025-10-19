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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        fetch('/api/v1/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'support',
                message,
                name,
                email,
                category: issueType,
                anonymous: false,
                source: 'web'
            })
        }).then(async (res) => {
            setIsSubmitting(false);
            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                setError(payload.message || 'Failed to send message');
                return;
            }
            setSuccess("Your message has been sent. We'll get back to you soon!");
            setForm({ name: "", email: "", issueType: "", message: "" });
        }).catch((err) => {
            setIsSubmitting(false);
            setError('Network error — unable to send message');
            console.error('Support submit error', err);
        });
    };

    return (
        <div className="flex items-center justify-center" style={{height:'calc(100vh - 80px)'}}>
            <div className="p-10 rounded-2xl shadow-2xl w-[40%] max-w-sm flex flex-col items-center"
                style={{ border: '2px solid springgreen', borderRadius: '17px', padding: '30px', width: '-webkit-fill-available', maxWidth: '340px' }}>
                <h2 className="text-3xl text-center mb-[10px]">Contact Support</h2>
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    {["name", "email"].map((field) => (
                        <div key={field} style={{marginTop:'10px'}}>
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
                    <div style={{marginTop:'10px'}}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Type</label>
                        <select
                            name="issueType"
                            value={form.issueType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                            style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '4px 0', color: 'black' }}
                        >
                            <option value="">Select Issue</option>
                            {issueOptions.map((issue) => (
                                <option key={issue} value={issue}>{issue}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{marginTop:'10px'}}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                            style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '4px 0', color: 'black' }}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    {success && <div className="text-green-600 text-sm text-center">{success}</div>}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                        style={{ marginTop: '10px' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SupportForm;
