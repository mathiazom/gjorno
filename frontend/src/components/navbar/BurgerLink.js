import React from "react";
import {
    Link,
    useRouteMatch
} from "react-router-dom";

export default function BurgerLink({ label, to }) {

    /**
     * Link wrapper that closes BurgerMenu on click
     */
    let match = useRouteMatch({
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