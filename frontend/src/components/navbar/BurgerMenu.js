import React from 'react';
import BurgerLink from './BurgerLink';
import './BurgerMenu.css';

const BurgerMenu = () => {
    return (
        <div id="menuToggle">
            <input id="burger-checkbox" type="checkbox"/>

            <span/>
            <span/>
            <span className={"mb-0"} />

            <ul id="menu" className={"bg-success"}>
                <li><BurgerLink to={"/"} label={"Aktiviteter"}/></li>
                <li><BurgerLink to={"/activity/create"} label={"Ny aktivitet"}/></li>
                <li><BurgerLink to={"/profile"} label={"Profil"}/></li>
            </ul>
        </div>
    )
}

export default BurgerMenu;

