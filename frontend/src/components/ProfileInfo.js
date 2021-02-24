import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/current_user/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }})
            .then(res => {
                this.setState({data: res.data});
            });
    }

    render() {
        return (
            <div className="card profileInfo" >
                <img className="card-img-top" src="/images/profil.png" alt="profile"/>
                <div className="card-body">
                    <h4 className="card-title">{this.state.data.username}</h4>
                    <p className="card-text mb-2">{this.state.data.email}</p>
                    <p className="card-text">Telefon: {this.state.data.phone_number}</p>
                    <Link to={"/profile/edit/"} className="btn btn-success">Rediger profil</Link>
                </div>
            </div>
        );
    }
}