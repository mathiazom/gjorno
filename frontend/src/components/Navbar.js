import React from 'react';
import Title from './Title';
import LoginButton from './LoginButton';
import BurgerMenu from './BurgerMenu';
import LogoutButton from './LogoutButton';

const Navbar = () => {
    return(
        <div id="navbar" className={"p-4 ps-5 pe-5 sticky-top shadow-sm bg-white row align-items-center justify-content-between"}>
            <div className={"col-2"}>
                <BurgerMenu/>
            </div>
            <div className={"col text-center text-success"}>
                <Title/>
            </div>
            <div className={"col-2 d-flex justify-content-end"}>
                {window.localStorage.getItem('Token') === null ? <LoginButton/> : <LogoutButton />}
            </div>
        </div>
    )
}

export default Navbar;