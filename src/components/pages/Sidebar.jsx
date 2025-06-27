import React, { useState } from 'react';
import {Drawer,List,ListItem,ListItemText,Button,ListItemIcon,IconButton,Box} from '@mui/material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';

const menuItems = [
  {
    label: 'Knowledge Hub',
    icon: <MenuBookOutlinedIcon />,
    subcategories: ['Articles', 'Tutorials', 'FAQs'],
  },
  {
    label: 'Contact Us',
    icon: <ContactMailOutlinedIcon />,
    subcategories: ['Support', 'Feedback'],
  },
];

const Sidebar = ({ open, toggleDrawer }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <aside className="fixed z-50">
      <Box
        sx={{
          position: 'fixed',
          top: '80px',
          left: open ? '282px' : '10px',
          zIndex: 1000,
          transition: 'left 0.3s ease-in-out',
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          className="bg-white/50 backdrop-blur-md text-black hover:bg-green-400 shadow-md"
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(4px)',
            marginTop: '74px',
            padding: '10px',
            borderRadius: '17px',
            height: 'auto',
          },
          '& .MuiBackdrop-root': {
            marginTop: '60px !important',
          },'& .MuiPaper-root':{
            margin: '74px 0px 10px 10px',
            height: 'calc(100vh - 104px)',
          }
        }}
      >
        <div className="flex flex-col justify-between h-[97vh] w-[240px]">
          <List>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={() => handleToggle(index)}
                  className="hover:bg-gray-200 rounded-lg"
                >
                  <ListItemIcon className="min-w-[40px] text-black">
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    className="text-black font-medium"
                  />
                  {expandedIndex === index ? (
                    <ExpandLess className="ml-2" />
                  ) : (
                    <ExpandMore className="ml-2" />
                  )}
                </ListItem>

                {expandedIndex === index &&
                  item.subcategories.map((sub, subIndex) => {
                    const isLast = subIndex === item.subcategories.length - 1;
                    return (
                      <ListItem
                        key={subIndex}
                        className={`relative ml-10 py-1 pl-2 ${
                          isLast ? 'last-sub-item' : ''
                        }`} style={{marginLeft: '46px', width: 'auto'}}
                      >
                        {!isLast && (
                          <div className="sidebarcurves absolute left-[-20px] top-0 w-[20px] h-full z-10">
                            <div className="sidebarlines absolute top-0 left-0 w-[2px] h-full bg-gray-400 z-10" />
                          </div>
                        )}
                        <div className="sidebarcurves absolute left-[-20px] top-0 w-[20px] h-full text-gray-400 z-20">
                          <div className="sidebarcurves absolute top-0 left-0 w-[16px] h-[20px] border-l-[2px] border-b-[2px] border-black-400 rounded-bl-[15px]" />
                        </div>
                        <ListItemText
                          primary={sub}
                          className="pl-2 text-sm text-gray-700"
                        />
                      </ListItem>
                    );
                  })}
              </React.Fragment>
            ))}
          </List>

          <div className="p-4">
            <button
              variant="contained"
              fullWidth
              className="accept-button bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-5 rounded-lg transition"
              style={{ padding: '8px 14px', margin: '0 10px', width: '90%' }}
            >
              Log In
            </button>
            <p className="text-[10px] mx-[10px] text-gray-700">Login to access all functionalities.</p>
          </div>
        </div>
      </Drawer>
    </aside>
  );
};

export default Sidebar;
