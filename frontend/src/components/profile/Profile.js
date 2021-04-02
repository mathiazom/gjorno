import React from 'react';
import MyActivities from './created/MyActivities';
import ProfileInfo from './ProfileInfo';
import FavoriteActivites from './favorite/FavoriteActivities';
import axios from 'axios';
import './Profile.css';
import MyLoggedActvitites from './log/MyLoggedActivities';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        axios.get('/api/current_user/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({data: res.data})
            }).catch(error => {
                console.log(error.response);
        });
    }

    render() {
        return(
            <div className="container-fluid w-75 mt-5">
                <div className="row">
                    <div className="col-md-3">
                        <ProfileInfo data={this.state.data}/>
                    </div>
                    <div className="col mt-5 mt-md-0">
                        <FavoriteActivites />
                        <MyActivities />
                        {this.state.data.is_organization == true ? null : <MyLoggedActvitites />}
                    </div>
                </div>
            </div>
        );
    }
}
