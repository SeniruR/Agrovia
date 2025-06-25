import React from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import logo from '../../assets/images/agrovia.png';
import {Link} from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-[80px] shadow-md z-50" style={{backgroundColor:'white', alignContent:'space-evenly'}}>
      <div className="flex items-center justify-between lg:px-6 md:px-4 px-2 h-full" style={{padding: '0 20px'}}>
        
        <div className="flex items-center">
          <Link to="/"><img src={logo} alt="Agrovia Logo" className="w-[70px] h-auto" style={{margin:'0 8px'}}/></Link>
        </div>

        <div className="flex items-center lg:gap-4 md:gap-2">
          <Link to="/profile"><button className="icon text-black hover:text-green-600 transition" style={{padding: '8px 14px',backgroundColor:'white', color:'black'}}>
            <PersonOutlined className="!w-[18px] !h-[18px]" />
          </button></Link>

          <button className="icon text-black hover:text-green-600 transition" style={{padding: '8px 14px',backgroundColor:'white', color:'black'}}>
            <ShoppingCartOutlinedIcon className="!w-[18px] !h-[18px]" />
          </button>

          <button className="icon text-black hover:text-green-600 transition" style={{padding: '8px 14px',backgroundColor:'white', color:'black'}}>
            <MenuIcon className="!w-[18px] !h-[18px]" />
          </button>

          <Link to="/login"><button className="accept-button text-white font-bold py-2 px-5 rounded-lg transition lg:mx-[10px] md:mx-[0px]" style={{padding: '8px 14px'}}>
            LOG IN
          </button></Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
