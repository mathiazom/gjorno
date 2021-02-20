import React from 'react';

const BurgerMenu = () => {
    return(
        <div id="menuToggle">
            <input type="checkbox" />

            <span></span>
            <span></span>
            <span className={"mb-0"}></span>

            <ul id="menu">
                <a href="#"><li>Aktiviteter</li></a>
                <a href="#"><li>Organisert</li></a>
                <a href="#"><li>Profil</li></a>
            </ul>
        </div>
    )
}

export default BurgerMenu;

