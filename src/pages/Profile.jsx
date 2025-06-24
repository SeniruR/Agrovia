import { useState } from "react";

const Profile = () => {
    const [profile, setProfile] = useState({
        name: "",
        nic: "",
        email: "",
        address: "",
        district: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setProfile({
            ...profile,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Profile updated successfully!");
    };

    return (
        <div className="flex items-center justify-center" style={{ height: "calc(100vh - 80px)" }}>
            <div
                className="p-10 rounded-2xl shadow-2xl w-[40%] max-w-2xl flex flex-col items-center"
                style={{
                    border: "2px solid springgreen",
                    borderRadius: "17px",
                    padding: "30px",
                    width: "-webkit-fill-available",
                    maxWidth: "600px",
                }}
            >
                <h2 className="text-3xl mb-8 text-center text-green-700">My Profile</h2>
                <div className="w-24 h-24 rounded-full border-2 border-green-600 bg-gray-100 flex items-center justify-center overflow-hidden mb-8">
                    {profile.image ? (
                        <img
                            src={URL.createObjectURL(profile.image)}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-400 text-3xl">👤</span>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                style={{
                                    backgroundColor: "white",
                                    padding: "10px",
                                    width: "-webkit-fill-available",
                                    borderRadius: "10px",
                                    margin: "8px 0",
                                    color: "black",
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">NIC</label>
                            <input
                                id="nic"
                                type="text"
                                name="nic"
                                value={profile.nic}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                style={{
                                    backgroundColor: "white",
                                    padding: "10px",
                                    width: "-webkit-fill-available",
                                    borderRadius: "10px",
                                    margin: "8px 0",
                                    color: "black",
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                style={{
                                    backgroundColor: "white",
                                    padding: "10px",
                                    width: "-webkit-fill-available",
                                    borderRadius: "10px",
                                    margin: "8px 0",
                                    color: "black",
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                style={{
                                    backgroundColor: "white",
                                    padding: "10px",
                                    width: "-webkit-fill-available",
                                    borderRadius: "10px",
                                    margin: "8px 0",
                                    color: "black",
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">District</label>
                            <input
                                id="district"
                                type="text"
                                name="district"
                                value={profile.district}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                                style={{
                                    backgroundColor: "white",
                                    padding: "10px",
                                    width: "-webkit-fill-available",
                                    borderRadius: "10px",
                                    margin: "8px 0",
                                    color: "black",
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Image</label>
                            <input
                                id="image"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full text-sm text-gray-600"
                                style={{
                                    backgroundColor: "white",
                                    padding: "10px",
                                    width: "-webkit-fill-available",
                                    borderRadius: "10px",
                                    margin: "8px 0",
                                    color: "black",
                                }}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                        style={{ marginTop: "10px" }}
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;