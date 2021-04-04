import React from 'react';
import '../profile/Profile.css';
import {formatPhoneNumber, stringIsEmail, stringIsPhoneNumber} from "../common/Utils";

export default class ActivityHost extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card">
                <img className="card-img-top img-fluid profile-image"
                     src={this.props.userdata.avatar || "/images/profil.png"} alt="profile"/>
                <div className="card-body">
                    <h4 className="card-title">{this.props.userdata.username}</h4>
                    {stringIsEmail(this.props.userdata.email) &&
                    <p className="card-text mb-2">{this.props.userdata.email}</p>
                    }
                    {stringIsPhoneNumber(this.props.userdata.phone_number) &&
                    <p className="card-text">Tlf.: {formatPhoneNumber(this.props.userdata.phone_number)}</p>
                    }
                </div>
            </div>
        );
    }
}
