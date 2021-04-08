import React from 'react';
import {Link} from 'react-router-dom';
import {formatPhoneNumber} from "../utils/Utils";
import {OrganizationIcon} from "../activitydetails/OrganizationIcon";

/**
 * Information card for profil details of currently logged in user
 */
export default class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card" >
                <img className="card-img-top img-fluid profile-image" src={this.props.user.avatar || "/images/profil.png"} alt="profile"/>
                <div className="card-body">
                    <h4 className="card-title d-flex">{this.props.user.username}
                        {/* Verified icon for organizations */}
                        {this.props.user.is_organization &&
                        <OrganizationIcon />
                        }
                    </h4>
                    <p className="card-text mb-2">{this.props.user.email}</p>
                    {this.props.user.phone_number &&
                        <p className="card-text">Tlf.: {formatPhoneNumber(this.props.user.phone_number)}</p>
                    }
                    <Link to={"/profile/edit/"} className="btn btn-outline-success">Rediger profil</Link>
                </div>
            </div>
        );
    }
}
