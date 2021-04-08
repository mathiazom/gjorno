import React from 'react';
import '../profile/Profile.css';
import {formatPhoneNumber} from "../utils/Utils";
import {stringIsEmail, stringIsPhoneNumber} from "../utils/ValidationUtils";
import {OrganizationIcon} from "./OrganizationIcon";

/**
 * Information card for activity author/host
 */
export default class ActivityAuthor extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card">
                <img className="card-img-top img-fluid profile-image"
                     src={this.props.author?.avatar || "/images/profil.png"} alt="profile"/>
                <div className="card-body">
                    <h4 className="card-title d-flex text-break">{this.props.author?.username}
                        {/* Verified icon for organizations */}
                        {this.props.author?.is_organization &&
                        <OrganizationIcon />
                        }
                    </h4>
                    {stringIsEmail(this.props.author?.email) &&
                    <p className="card-text mb-2">{this.props.author?.email}</p>
                    }
                    {stringIsPhoneNumber(this.props.author?.phone_number) &&
                    <p className="card-text">Tlf.: {formatPhoneNumber(this.props.author?.phone_number)}</p>
                    }
                </div>
            </div>
        );
    }

}
