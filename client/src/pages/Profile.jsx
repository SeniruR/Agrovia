import { useRef, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    nic: "",
    email: "",
    address: "",
    district: "",
    image: null,
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfile({
      ...profile,
      [name]: files ? files[0] : value,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-10">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-6xl p-10 flex flex-col md:flex-row gap-12">
        
        {/* LEFT SIDE: Heading + Image */}
        <div className="md:w-1/3 flex flex-col items-start justify-start space-y-6 pt-4 pl-2">
          <h2 className="text-4xl font-bold text-green-700">My Profile</h2>
          <div
            className="w-40 h-40 rounded-full border-4 border-green-500 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleImageClick}
            title="Click to change profile image"
          >
            {profile.image ? (
              <img
                src={URL.createObjectURL(profile.image)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-5xl">👤</span>
            )}
          </div>
          <input
            type="file"
            name="image"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </div>

        {/* RIGHT SIDE: Form Fields */}
        <form onSubmit={handleSubmit} className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">NIC</label>
            <input
              type="text"
              name="nic"
              value={profile.nic}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="district"
              value={profile.district}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">District</label>
            <input
              type="text"
              name="district"
              value={profile.district}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;