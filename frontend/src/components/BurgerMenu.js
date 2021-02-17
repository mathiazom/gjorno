import React from 'react';

const BurgerMenu = () => {
    return(
        <div id="menuToggle">

            <input type="checkbox" />

            <ul id="menu">
            <a href="#"><li>Test</li></a>
            <a href="#"><li>Test</li></a>
            <a href="#"><li>Test</li></a>
            <a href="#"><li>Test</li></a>
            </ul>

            <span className="burgers"></span>
            <span className="burgers"></span>
            <span className="burgers"></span>

        </div>
    )
}

export default BurgerMenu;

