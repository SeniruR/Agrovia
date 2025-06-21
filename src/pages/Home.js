import './css/Home.css';
import { useState } from 'react';
import Navigation from '../components/pages/Navigation';
import Sidebar from '../components/pages/Sidebar';
import Users from './Users';

function Home() {

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  return (
    <div className="app-container">
      <Navigation />
      <div className="main-content-wrapper">
        
        <div className="main-content">
          <Sidebar open={open} toggleDrawer={toggleDrawer} />
          <Users />
        </div>
      </div>
    </div>
  );
}

export default Home;
