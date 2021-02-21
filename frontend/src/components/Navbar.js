import React from 'react';
import Title from './Title';
import LoginButton from './LoginButton';
import BurgerMenu from './BurgerMenu';

const Navbar = () => {
    return(
        <div id="navbar" className={"p-4 ps-5 pe-5 sticky-top shadow-sm"}>
            <BurgerMenu/>
            <Title/>
            <LoginButton/>
        </div>
    )
}

export default Navbar;