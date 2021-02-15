import React from 'react';
import Title from './Title';
import Login from './Login';
import BurgerMenu from './BurgerMenu';

const Navbar = () => {
    return(
        <div id="navbar">
            <BurgerMenu/>
            <Title/>
            <Login/>
        </div>
        
    )
}

export default Navbar;