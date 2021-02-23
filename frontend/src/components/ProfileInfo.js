import React from 'react';
import axios from 'axios';

export default class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = `Token ${window.localStorage.getItem("Token")}`;
        axios.get('http://localhost:8000/api/current_user/')
            .then(res => {
                this.setState({data: res.data});
            });
    }

    render() {
        return (
            <div className="card profileInfo" >
                <img className="card-img-top" src="images/profil.png" alt="profile"/>
                <div className="card-body">
                    <h4 className="card-title">{this.state.data.username}</h4>
                    <p className="card-text mb-2">{this.state.data.email}</p>
                    <p className="card-text">Telefon: {this.state.data.phone_number}</p>
                    <a href="#" className="btn btn-outline-success">Rediger profil</a>
                </div>
            </div>
        );
    }
}