import React from 'react';
import {Link} from 'react-router-dom';
import BurgerLink from './BurgerLink'

const BurgerMenu = () => {
    return (
        <div id="menuToggle">
            <input id="burger-checkbox" type="checkbox"/>

            <span/>
            <span/>
            <span className={"mb-0"} />

            <ul id="menu" className={"bg-success"}>
                <li><BurgerLink to={"/"} label={"Aktiviteter"}/></li>
                <li><BurgerLink to={"/create-activity"} label={"Ny aktivitet"}/></li>
                <li><Link className={"text-white-50"}>Organisert</Link></li>
                <li><BurgerLink to={"/profile"} label={"Profil"}/></li>
            </ul>
        </div>
    )
}

export default BurgerMenu;

