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
        axios.get('http://localhost:8000/api/current_user/')
            .then(res => {
                //this.setState({data: res.data});
                console.log(res.data);
            });
    }

    render() {
        return (
            <div className="card profileInfo" >
                <img className="card-img-top" src="images/profil.png" alt="profile"></img>
                <div className="card-body">
                    <h2 className="card-title">Ola Nordmann</h2>
                    <p className="card-text">Trondheim, Norge</p>
                    <p className="card-text">97876513</p>
                    <a href="#" className="btn btn-outline-success">Rediger profil</a>
                </div>
            </div>
        );
    }
}