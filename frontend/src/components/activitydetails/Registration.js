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

    register() {
        const now = new Date();
        const temp = this.props.activity.registration_deadline;
        const deadline = new Date(temp.slice(0,4), temp.slice(5,7)-1, temp.slice(8,10), temp.slice(11,13), temp.slice(14,16));
        if (now < deadline) {
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

    unregister() {
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
    
    render() {
        return (
            <div className="card profileInfo mt-2">
                <div className="card-body">
                    {/*<p>{usernames}</p>  We could have a button if the current user is the owner to see all users in a pop-up. */}
                    {/*const usernames = this.state.participants.map(function(participant){ return participant["username"] + "\n"});*/}
                    <label className="card-text mt-2">
                        Påmeldte: {this.props.activity.registrations_count} av {this.props.activity.registration_capacity}
                    </label>
                    <label className="card-text mt-2">
                        Frist for påmelding: {this.props.activity.registration_deadline.slice(0,10).replace(/-/g, ".") + " " + this.props.activity.registration_deadline.slice(11,16)}
                    </label>
                    <label className="card-text mt-2">
                        Dato: {this.props.activity.starting_time.slice(0,10).replace(/-/g, ".")}
                    </label>
                    <label className="card-text mt-2">
                        Tidspunkt: {this.props.activity.starting_time.slice(11,16)}
                    </label>
                    <label className="card-text mt-2">
                        Sted: {this.props.activity.location}
                    </label>
                    {console.log(this.props.activity)}
                    {
                        this.props.activity.is_registered == true ? 
                            <button className={"btn btn-danger w-100 mt-3 mb-1"} onClick={this.unregister}>Meld av</button>
                            :
                            <button className={"btn btn-success w-100 mt-3 mb-1"} onClick={this.register}>Meld på</button> 
                    }
                </div>
            </div>
        );
    }
}
