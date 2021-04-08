import React from "react";
import {
    Link,
    useRouteMatch
} from "react-router-dom";

/**
 * Specialized Link for use in BurgerMenu
 */
export default function BurgerLink({ label, to }) {

    /**
     * Link wrapper that closes BurgerMenu on click
     */
    const match = useRouteMatch({
        path: to,
        exact: true
    });

    /**
     * Uncheck a checkbox to close the burger-menu.
     */
    const closeBurger = () => {
        document.getElementById("burger-checkbox").checked = false;
    }

    return (
        <div className={match ? "fw-bold" : ""}>
            <Link to={to} onClick={closeBurger}>{label}</Link>
        </div>
    );
}