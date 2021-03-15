import axios from 'axios';
import React from 'react';

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            participants: []
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
                if (res.data.username == this.props.activity.username) {
                    axios.get(`http://localhost:8000/api/activities/${this.props.activity.id}/registrations/`,
                    { headers: {
                        "Authorization": `Token ${window.localStorage.getItem("Token")}`
                    }}
                    ).then(res =>
                        this.setState({participants: res.data}),
                        ).catch(error => {
                            console.log(error.response);
                    });
                }
            }).catch(error => {
                console.log(error.response);
            });
    }

    register(){
        const now = new Date();
        const temp = this.props.activity.registration_deadline;
        const deadline = new Date(temp.slice(0,4), temp.slice(5,7)-1, temp.slice(8,10), temp.slice(11,13), temp.slice(14,16));
        if (now > deadline) {
            console.log(":(")
        }
        else {
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
                window.location.reload();
            }
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
        window.location.reload()
    }

   /*Check if user is registered before displaying the button*/ 
    render() {
        const usernames = this.state.participants.map(function(participant){ return participant["username"] + "\n"});
        return (
            <div>
                <p>{usernames}</p>
                <p>Ant. påmeldte: {this.props.activity.registrations_count}/{this.props.activity.registration_capacity}</p>
                <p>Frist for påmelding: {this.props.activity.registration_deadline.slice(0,10).replace(/-/g, ".") + " " + this.props.activity.registration_deadline.slice(11,16)}</p>
                <p>Dato: {this.props.activity.starting_time.slice(0,10).replace(/-/g, ".")}</p>
                <p>Tid: {this.props.activity.starting_time.slice(11,16)}</p>
                <p>Sted: {this.props.activity.location} </p>

                {/*Fix this*/}
                {this.props.activity.is_registered ?                               
                        <button onClick={this.register}>Meld på</button>
                      : <button onClick={this.unregister}>Meld av</button>}
                
                {/*Temporary until actual check is fixed*/}
                <button onClick={this.register}>Meld på</button>
            </div>
        );
    }
}
