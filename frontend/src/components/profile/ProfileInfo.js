import React from 'react';
import {Link} from 'react-router-dom';

export default class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
    }
            
    render() {
        return (
            <div className="card profileInfo" >
                <img className="card-img-top" src="/images/profil.png" alt="profile"/>
                <div className="card-body">
                    <h4 className="card-title" id="profile-username">{this.props.data.username}</h4>
                    <p className="card-text mb-2">{this.props.data.email}</p>
                    <p className="card-text">Telefon: {this.props.data.phone_number}</p>
                    <Link to={"/profile/edit/"} className="btn btn-success">Rediger profil</Link>
                </div>
            </div>
        );
    }
}