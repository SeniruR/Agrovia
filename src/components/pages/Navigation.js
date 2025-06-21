import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import '../css/Navigation.css';

const Navigation = () => {
    return(
        <nav className='navbar'>
        <AppBar position="fixed">
            <Toolbar sx={{backgroundColor:'var(--background-color)',color:'black'}}>
                <Typography variant="h6" component="div"
                sx={{
                    flexGrow:1,
                    textAlign:'left'
                }}>
                <img className="nav-logo" src="/Images/agrovia.png" alt="Agrovia Logo"/>
                </Typography>
                <Button color="inherit"><ShoppingCartOutlinedIcon /></Button>
                {/* <Button color="inherit"><PersonOutlineIcon /></Button> */}
                <Button color="inherit"><MenuIcon /></Button>
                <Button className="login-button" sx={{
                    color: 'var(--login-button-text-color)',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    margin: '0px 10px 0px 20px',
                    padding: '6px 18px',
                    backgroundColor: 'var(--login-button-color)',
                    textDecoration: 'none'}}>Log In</Button>
            </Toolbar>
        </AppBar>
        </nav>
    );
};

export default Navigation;