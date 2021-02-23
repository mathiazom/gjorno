import React from 'react';
import { Link } from 'react-router-dom';
import BurgerLink from './BurgerLink'

const BurgerMenu = () => {
    return(
        <div id="menuToggle">
            <input id="burger-checkbox" type="checkbox" />

            <span></span>
            <span></span>
            <span className={"mb-0"}></span>

            <ul id="menu">
                <li><BurgerLink to={"/"} label={"Aktiviteter"}/></li>
                <li><Link className={"text-white-50"}>Organisert</Link></li>
                <li><BurgerLink to={"/profile"} label={"Profil"}/></li>
            </ul>
        </div>
    )
}

export default BurgerMenu;

