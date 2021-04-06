import React from 'react';
import { Link } from 'react-router-dom';

const Title = () => {
    return (
        <div className="position-relative">
            <h1 className={"display-5"}>
                <Link to={"/"} className={"no-decoration text-success"}>
                    GjørNo
                </Link>
            </h1>
        </div>
    );
}

export default Title;