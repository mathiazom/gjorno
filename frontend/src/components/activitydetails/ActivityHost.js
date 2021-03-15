import React from 'react';

export default class ActivityHost extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card profileInfo" >
                <img className="card-img-top" src="/images/profil.png" alt="profile"/>
                <div className="card-body">
                    <h4 className="card-title">{this.props.userdata.username}</h4>
                    <p className="card-text mb-2">{this.props.userdata.email}</p>
                    <p className="card-text">Telefon: {this.props.userdata.phone_number}</p>
                </div>
            </div>
        );
    }
}
