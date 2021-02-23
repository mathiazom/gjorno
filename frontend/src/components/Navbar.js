import React from 'react';
import Title from './Title';
import LoginButton from './LoginButton';
import BurgerMenu from './BurgerMenu';
import LogoutButton from './LogoutButton';

const Navbar = () => {
    return(
        <div id="navbar" className={"p-4 ps-5 pe-5 sticky-top shadow-sm"}>
            <BurgerMenu/>
            <Title/>
            {window.localStorage.getItem('Token') === null ? <LoginButton/> : <LogoutButton />}
        </div>
    )
}

export default Navbar;