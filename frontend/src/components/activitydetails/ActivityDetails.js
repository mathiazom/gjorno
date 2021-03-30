import React from 'react';
import axios from 'axios';
import ActivityHost from "./ActivityHost.js";
import DetailedActivity from "./DetailedActivity.js";
import Registration from "./Registration.js";
import {Link, withRouter} from 'react-router-dom';
import {toast} from "react-toastify";

class ActivityDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activity: [],
            user: []
        };
        this.getActivity = this.getActivity.bind(this);
        this.favorite = this.favorite.bind(this);
        this.unfavorite = this.unfavorite.bind(this);
        this.log = this.log.bind(this);
    }

    componentDidMount() {
        this.getActivity();
    }

    getActivity() {
        // Include auth token only if it exists (user is logged in)
        // otherwise browse the activity anonymously
        const headers = {}
        if (this.props.authenticated) {
            headers['Authorization'] = `Token ${window.localStorage.getItem("Token")}`
        }
        axios
            .get(`http://localhost:8000/api/activities/${this.props.match.params.id}/?register_view`, {
                headers: headers
            })
            .then(res => {
                this.setState({activity: res.data})
                this.getActivityAuthor()
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    getActivityAuthor() {
        axios
            .get(`http://localhost:8000/api/users/${this.state.activity.user}`)
            .then(res => {
                this.setState({user: res.data})
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    /**
     * Sends a POST request to the API, and adds the activity to the
     * currently logged in user's favorites list.
     */
    favorite() {
        axios.post(`http://localhost:8000/api/activities/${this.state.activity.id}/favorite/`,
            null,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            }).then(res => {
            if (res.status === 201) {
                toast("Favoritt lagt til 😍", {containerId: 'info-toast-container'});
                // Refresh activity data to see correct favorite icon
                this.getActivity();
            }
        }).catch(error => {
            console.log(error.response);
        })
    }

    /**
     * Sends a POST request to the API to remove the activity
     * from the currently logged in user's favorites list.
     */
    unfavorite() {
        axios.post(`http://localhost:8000/api/activities/${this.state.activity.id}/unfavorite/`,
            null,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            }).then(res => {
            if (res.status === 200) {
                toast("Favoritt fjernet 💔️", {containerId: 'info-toast-container'});
                // Refresh activity data to see correct favorite icon
                this.getActivity();
            }
        }).catch(error => {
            console.log(error.response);
        })
    }

    /**
     * Sends a POST request to the API to create a log for this activity
     */
    log() {
        axios.post(`http://localhost:8000/api/activities/${this.state.activity.id}/log/`,
            null,
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            }).then(res => {
            if (res.status === 201) {
                toast("Gjennomføring registrert 🎉", {containerId: 'info-toast-container'});
            }
        }).catch(error => {
            console.log(error.response);
        })
    }

    render() {
        let img = this.state.activity.image;
        return (
            <>
                {img == null || <img src={img} className="img-fluid activity-details-banner" alt={"Aktivitetsbilde"}/>}
                <div className="container-fluid w-100 mt-5" style={{marginBottom: "300px"}}>
                    <div className="row">
                        <div className="col col-md-2 offset-sm-1">
                            <ActivityHost userdata={this.state.user}/>
                            {(this.state.activity.activity_level || this.state.activity.has_registration) &&
                            <div className="card mt-2">
                                <div className="card-body">
                                    {this.state.activity.activity_level &&
                                    (<>
                                        <div><b>Nivå</b></div>
                                        <label className="card-text mb-2">
                                            {["Lett", "Moderat", "Krevende"][this.state.activity.activity_level - 1]}
                                        </label>
                                    </>)
                                    }
                                    {this.state.activity.has_registration &&
                                    <Registration activity={this.state.activity} onUpdate={this.getActivity}
                                                  authenticated={this.props.authenticated}/>
                                    }
                                </div>
                            </div>
                            }
                            {this.props.authenticated &&
                            <div className="card mt-2 p-3">
                                <div className="d-xl-flex justify-content-evenly">
                                    <div className="d-flex align-items-center flex-column">
                                        {/* Favorite button, hidden for an unauthorized user */}
                                        {this.state.activity.is_favorited &&
                                        <a title="Fjern fra favoritter" className="text-success" role="button"
                                           onClick={this.unfavorite}><i
                                            className="fas fa-heart fa-2x"/></a>
                                        }
                                        {!this.state.activity.is_favorited &&
                                        <a title="Legg til favoritt" className="text-success" role="button"
                                           onClick={this.favorite}><i
                                            className="far fa-heart fa-2x"/></a>
                                        }
                                    </div>
                                    {!this.state.activity.has_registration &&
                                    <div className="d-flex align-items-center flex-column mt-4 mt-xl-0">
                                        <a title="Registrer gjennomføring" className="text-success" role="button"
                                           onClick={this.log}>
                                            <i id={"log-button-icon"} className="far fa-check-circle fa-2x"/>
                                        </a>
                                    </div>
                                    }
                                    {!this.state.activity.is_author &&
                                    <div className="d-flex align-items-center flex-column mt-4 mt-xl-0">
                                        <a title={this.state.activity.has_registration && "Kontakt arrangør" || "Kontakt forfatter"}
                                           className="text-success" role="button"><i className="far fa-envelope fa-2x"/></a>
                                    </div>
                                    }
                                </div>
                            </div>
                            }
                            {(this.props.authenticated && this.state.activity.is_author) &&
                            <Link to={`/edit-activity/${this.state.activity.id}`}>
                                <button id={"edit-button"}
                                        className={"btn btn-outline-success w-100 mt-3 mb-1"}>Rediger
                                </button>
                            </Link>
                            }
                        </div>
                        <div className="col col-md-7 offset-sm-1">
                            <DetailedActivity activity={this.state.activity} authenticated={this.props.authenticated}/>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(ActivityDetails);
