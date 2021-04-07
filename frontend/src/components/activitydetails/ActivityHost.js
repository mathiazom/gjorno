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
                     src={this.props.userdata?.avatar || "/images/profil.png"} alt="profile"/>
                <div className="card-body">
                    <h4 className="card-title d-flex">{this.props.userdata?.username}
                        {/* Verified icon for organizations */}
                        {this.props.userdata?.is_organization &&
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-patch-check-fill text-primary ms-1 align-self-center" viewBox="0 0 16 16">
                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                            <title>Organisasjon</title>
                        </svg>
                        }
                    </h4>
                    {stringIsEmail(this.props.userdata?.email) &&
                    <p className="card-text mb-2">{this.props.userdata?.email}</p>
                    }
                    {stringIsPhoneNumber(this.props.userdata?.phone_number) &&
                    <p className="card-text">Tlf.: {formatPhoneNumber(this.props.userdata?.phone_number)}</p>
                    }
                </div>
            </div>
        );
    }
}
