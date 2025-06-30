import React from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import Navigation from "../components/pages/Navigation";
import Sidebar from "../components/pages/Sidebar";

const Users = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => setOpen(!open);

  return (
    <>
            <button
              onClick={() => navigate("/")}
              className="mb-4 text-green-600 font-semibold text-lg rounded px-4 py-2 border border-green-600 hover:bg-green-100 transition"
            >
              Back
            </button>
            <UserForm />
    </>
  );
};

export default Users;
