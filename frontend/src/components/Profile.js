import React from 'react';
import Log from './Log';
import ProfileInfo from './ProfileInfo';

const Profile = () => {
    return(
        <div className="container-fluid w-75 mt-5">
            <div className="row">
                <div className="col-3">
                    <ProfileInfo />
                </div>
                <div className="col">
                    <Log />
                </div>
            </div>
        </div>
    );
}

export default Profile;
