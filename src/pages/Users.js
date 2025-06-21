import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import UserForm from "./UserForm";
import Navigation from '../components/pages/Navigation';
import Sidebar from '../components/pages/Sidebar';

const Users = () => {

    const navigate = useNavigate();

    return(
        <>
          <button className='submit' onClick={() => navigate('/users')}>Back</button>
          <UserForm />
        </>
    );
}

export default Users;