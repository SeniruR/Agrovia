import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Button, ListItemIcon, Box, IconButton } from '@mui/material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import '../css/Sidebar.css';

const menuItems = [
    {
        label: 'Knowledge Hub',
        icon: <MenuBookOutlinedIcon />,
        subcategories: ['Articles', 'Tutorials', 'FAQs']
    },
    {
        label: 'Contact Us',
        icon: <ContactMailOutlinedIcon />,
        subcategories: ['Support', 'Feedback']
    },
];

const Sidebar = ({ open, toggleDrawer }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleToggle = (index) => {
        setExpandedIndex(prev => (prev === index ? null : index));
    };

    return (
        <aside className='sidebar'>
            <Box
                sx={{
                    position: 'fixed',
                    top: 80,
                    left: open ? '282px' : '10px',
                    zIndex: 1,
                    transition: 'left 0.3s ease-in-out',
                }}
            >
                <IconButton
                    onClick={toggleDrawer}
                    sx={{
                        color: 'var(--background-black)',
                        backgroundColor: 'var(--transparent-white)',
                        boxShadow: 3,
                        zIndex: 1,
                        '&:hover': { backgroundColor: 'var(--green-for-hover)' },
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>
            <Drawer
                sx={{ '& .MuiDrawer-paper': { backgroundColor: 'var(--transparent-white)' , backdropFilter: 'blur(4px)'} }}
                className="sidebar-drawer"
                anchor="left"
                open={open}
                onClose={toggleDrawer}
            >
                <div className="main-component-div" style={{ display: 'flex', height: '100vh',flexDirection: 'column', height: '97%' }}>
                    <List className="sidebar">
                        {menuItems.map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem className="ListItem main-item" button onClick={() => handleToggle(index)}>
                                    <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
                                    <ListItemText className='ListItemText' primary={item.label} />
                                    {expandedIndex === index ? <ExpandLess className='ExpandLess' /> : <ExpandMore className='ExpandMore' />}
                                </ListItem>
                                {expandedIndex === index && item.subcategories && item.subcategories.map((sub, subIndex) => {
                                    const isLast = subIndex === item.subcategories.length - 1;
                                    return (
                                        <ListItem className={`ListItem sub-item ${isLast ? 'last-sub-item' : ''}`} key={subIndex}>
                                            <div className="connector-line" />
                                            <ListItemText primary={sub} className="subcategory-text" />
                                        </ListItem>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </List>
                    <div className="under-login-div">
                        <Button
                            variant="contained"
                            fullWidth
                            className="login-button"
                            sx={{
                                color: 'var(--login-button-text-color)',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                                backgroundColor: 'var(--login-button-color)',
                                textDecoration: 'none'
                            }}
                        >
                            Log In
                        </Button>
                        <p className="sidebar-login-text" style={{
                            fontSize: '10px',
                            margin: '5px 0 0 2px',
                            padding: '0px'
                        }}>
                            Login to access all functionalities.
                        </p>
                    </div>
                </div>
            </Drawer>
        </aside>
    );
};

export default Sidebar;
