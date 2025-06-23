import React from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../assets/images/agrovia.png';
import {Link} from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] shadow-md z-50" style={{backgroundColor:'white', alignContent:'space-evenly'}}>
      <div className="flex items-center justify-between px-6 py-3" style={{ margin: '10px'}}>
        
        <div className="flex items-center">
          <Link to="/"><img src={logo} alt="Agrovia Logo" className="w-[70px] h-auto" style={{margin:'0 8px'}}/></Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="icon text-black hover:text-green-600 transition" style={{padding: '8px 14px 6px 14px', margin:'0 10px',backgroundColor:'white', color:'black'}}>
            <ShoppingCartOutlinedIcon className="!w-[18px] !h-[18px]" />
          </button>

          <button className="icon text-black hover:text-green-600 transition" style={{padding: '8px 14px 6px 14px', margin:'0 10px',backgroundColor:'white', color:'black'}}>
            <MenuIcon className="!w-[18px] !h-[18px]" />
          </button>

          <button className="accept-button text-white font-bold py-2 px-5 rounded-lg transition" style={{padding: '8px 14px',margin:'0 10px'}}>
            LOG IN
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
