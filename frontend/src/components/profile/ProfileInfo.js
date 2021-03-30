import React from 'react';
import {Link} from 'react-router-dom';
import {formatPhoneNumber} from "../common/Utils";

export default class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
    }
            
    render() {
        return (
            <div className="card" >
                <img className="card-img-top img-fluid profile-image" src={this.props.data.avatar || "/images/profil.png"} alt="profile"/>
                <div className="card-body">
                    <h4 className="card-title" id="profile-username">{this.props.data.username}</h4>
                    <p className="card-text mb-2">{this.props.data.email}</p>
                    {this.props.data.phone_number && 
                        <p className="card-text">Tlf.: {formatPhoneNumber(this.props.data.phone_number)}</p>
                    }
                    <Link to={"/profile/edit/"} className="btn btn-outline-success">Rediger profil</Link>
                </div>
            </div>
        );
    }
}