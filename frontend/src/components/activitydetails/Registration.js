import axios from 'axios';
import React from 'react';

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/current_user/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }})
            .then(res => {
                this.setState({data: res.data});
            }).catch(error => {
                console.log(error.response);
            });
    }

    register(){
        axios.post(`http://localhost:8000/api/activities/${this.props.activity.id}/register/`, 
                {
                    activity: this.props.activity.id,
                    user: this.state.data.id
                },
                { headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            }
            ).catch(error => {
                console.log(error.response);
            });
    }

    unregister(){
        axios.post(`http://localhost:8000/api/activities/${this.props.activity.id}/unregister/`, 
        {
            activity: this.props.activity.id,
            user: this.state.data.id
        },
        { headers: {
            "Authorization": `Token ${window.localStorage.getItem("Token")}`
        }
    }
    ).catch(error => {
        console.log(error.response);
    });

    }

   /*Check if user is registered before displaying the button*/ 
    render() {
        return (
            <div>
                <p>Ant. plasser: {this.props.activity.registrations_count}/{this.props.activity.registration_capacity}</p>
                <p>Frist for påmelding: {this.props.activity.registration_deadline.slice(0,10).replace(/-/g, ".") + " " + this.props.activity.registration_deadline.slice(11,16)}</p>
                <p>Dato: {this.props.activity.starting_time.slice(0,10).replace(/-/g, ".")}</p>
                <p>Tid: {this.props.activity.starting_time.slice(11,16)}</p>
                <p>Sted: {this.props.activity.location} </p>
                <button onClick={this.register}>Meld på</button>
                <button onClick={this.unregister}>Meld av</button>
                <p>{this.state.isRegistered}</p>
            </div>
        );
    }
}
