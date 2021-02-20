import React from 'react';
import Title from './Title';
import Login from './Login';
import BurgerMenu from './BurgerMenu';

const Navbar = () => {
    return(
        <div id="navbar" className={"p-4 ps-5 pe-5 sticky-top shadow-sm"}>
            <BurgerMenu/>
            <Title/>
            <Login/>
        </div>
    )
}

export default Navbar;