import React from 'react';
import MyActivities from './MyActivities';
import ProfileInfo from './ProfileInfo';

const Profile = () => {
    return(
        <div className="container-fluid w-75 mt-5">
            <div className="row">
                <div className="col-3">
                    <ProfileInfo />
                </div>
                <div className="col">
                    <MyActivities />
                </div>
            </div>
        </div>
    );
}

export default Profile;
