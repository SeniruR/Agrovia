import React from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from '../../assets/images/agrovia.png';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-[80px] shadow-md z-50 bg-white">
      <div className="flex items-center justify-between px-6 h-full w-full">
        {/* Logo at absolute far left */}
        <div className="flex items-center justify-start">
          <Link to="/">
            <img src={logo} alt="Agrovia Logo" className="w-[80px] h-auto mr-3" />
          </Link>
        </div>

        {/* Icons & Get Started at absolute far right */}
        <div className="flex items-center gap-2 justify-end">
          <Link to="/profile">
            <button className="icon text-black hover:text-green-600 transition p-2 bg-white rounded-full">
              <PersonOutlined className="!w-[20px] !h-[20px]" />
            </button>
          </Link>
          <Link to="/cart">
            <button className="icon text-black hover:text-green-600 transition p-2 bg-white rounded-full">
              <ShoppingCartOutlinedIcon className="!w-[20px] !h-[20px]" />
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-green-600 text-white font-bold py-2 px-2 rounded-full transition hover:bg-green-700 ml-2 shadow-md flex items-center gap-1" style={{letterSpacing: '1px'}}>
              GET STARTED <ArrowForwardIcon className="!w-[18px] !h-[18px]" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
