import { useState } from "react";

const FeedbackForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    feedbackType: "",
    message: "",
    anonymous: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const feedbackOptions = [
    "Platform Experience",
    "Feature Suggestions",
    "Bug Report",
    "Community Feedback",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, feedbackType, message } = form;
    if (!feedbackType || !message || (!form.anonymous && (!name || !email))) {
      setError("Please fill in all required fields.");
      return;
    }
    setSuccess("Thank you for your feedback! It will be reviewed and may be shared on the platform.");
    setForm({ name: "", email: "", feedbackType: "", message: "", anonymous: false });
  };

  return (
    <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="p-10 rounded-2xl shadow-2xl w-[40%] max-w-sm flex flex-col items-center mx-[20px]"
        style={{ border: '2px solid springgreen', borderRadius: '17px', padding: '30px', width: '-webkit-fill-available', maxWidth: '430px' }}>
        <h2 className="text-3xl text-center mb-[10px]">Share Your Feedback</h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          All feedback is reviewed by moderators and may be displayed across the platform with or without your name.
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {!form.anonymous && ["name", "email"].map((field) => (
            <div key={field} style={{ marginTop: '10px' }}>
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
          <div style={{ marginTop: '10px' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback Type</label>
            <select
              name="feedbackType"
              value={form.feedbackType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              style={{ backgroundColor: 'white', padding: '10px', width: '-webkit-fill-available', borderRadius: '10px', margin: '4px 0', color: 'black' }}
            >
              <option value="">Select Type</option>
              {feedbackOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: '10px' }}>
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
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="anonymous"
              checked={form.anonymous}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-green-600"
            />
            <label className="text-sm text-gray-700">Submit anonymously</label>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
            style={{ marginTop: '10px' }}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
