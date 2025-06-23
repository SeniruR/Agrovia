import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
    const navigate = useNavigate();

    const roles = [
        { name: "Farmer", path: "/signup/farmer" },
        { name: "Shop Owner", path: "/signup/shop-owner" },
        { name: "Moderator", path: "/signup/moderator" },
        { name: "Transporter", path: "/signup/transporter" },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
            <div className="p-10 rounded-2xl shadow-2xl w-[90%] max-w-md text-center" style={{ border: '2px solid springgreen', borderRadius: '17px' ,width: 'max-content',padding: '20px'}}>
                <h2 className="text-3xl font-extrabold mb-8 text-green-700">Select Your Role</h2>
                <div className="grid grid-cols-1 gap-4">
                    {roles.map((role) => (
                        <button
                            key={role.name}
                            onClick={() => navigate(role.path)}
                            className="next-button bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition" style={{margin: '5px 0'}}
                        >
                            {role.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
