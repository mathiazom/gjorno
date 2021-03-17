import React from 'react';
import axios from 'axios';
import ActivityHost from "./ActivityHost.js";
import DetailedActivity from "./DetailedActivity.js";
import Registration from "./Registration.js";
import {Link, withRouter} from 'react-router-dom';
import {toast} from "react-toastify";
import {stringIsEmail, updatePageTitle} from "../common/Utils";

class ActivityDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activity: null,
            author: null,
            user: null
        };
        this.getActivity = this.getActivity.bind(this);
        this.favorite = this.favorite.bind(this);
        this.unfavorite = this.unfavorite.bind(this);
        this.log = this.log.bind(this);
    }

    componentDidMount() {
        this.getActivity();
        if (this.props.authenticated) {
            this.getUser();
        }
    }

    getActivity() {
        // Include auth token only if it exists (user is logged in)
        // otherwise browse the activity anonymously
        const headers = {}
        if (this.props.authenticated) {
            headers['Authorization'] = `Token ${window.localStorage.getItem("Token")}`
        }
        axios
            .get(`https://api.gjorno.site/api/activities/${this.props.match.params.id}/?register_view`, {
                headers: headers
            })
            .then(res => {
                updatePageTitle(res.data.title);
                this.setState({activity: res.data})
                this.getActivityAuthor()
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    getUser() {
        axios
            .get(`http://localhost:8000/api/current_user/`, {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({user: res.data})
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    getActivityAuthor() {
        axios
            .get(`https://api.gjorno.site/api/users/${this.state.activity.user}`)
            .then(res => {
                this.setState({author: res.data})
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
                // Refresh activity data to see correct favorited icon
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
                // Refresh activity data to see correct favorited icon
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
        let img = this.state.activity?.image;
        return (
            <>
                {img == null || <img src={img} className="img-fluid activity-details-banner" alt={"Aktivitetsbilde"}/>}
                <div className="container-fluid w-100 mt-md-5" style={{marginBottom: "300px"}}>
                    <div className="row">
                        <div className="col-12 col-md-3 col-xxl-2 offset-md-1 order-1 order-md-0">
                            <ActivityHost author={this.state.author}/>
                            {(this.state.activity?.activity_level || this.state.activity?.has_registration) &&
                            <div className="card mt-2">
                                <div className="card-body">
                                    {this.state.activity?.activity_level &&
                                    (<>
                                        <div><b>Nivå</b></div>
                                        <label className="card-text mb-2">
                                            {["Lett", "Moderat", "Krevende"][this.state.activity?.activity_level - 1]}
                                        </label>
                                    </>)
                                    }
                                    {this.state.activity?.has_registration &&
                                    <Registration activity={this.state.activity} onUpdate={this.getActivity}
                                                  authenticated={this.props.authenticated}/>
                                    }
                                </div>
                            </div>
                            }
                            <div className="card mt-2 p-3">
                                <div className="d-flex justify-content-evenly">
                                    <div className="d-flex align-items-center flex-column">
                                        {/* Favorite button, disabled for an unauthorized user */}
                                        {this.props.authenticated &&
                                        <>
                                            {this.state.activity?.is_favorited &&
                                            <a title="Fjern fra favoritter" className="text-success" role="button"
                                               onClick={this.unfavorite}><i
                                                className="fas fa-heart fa-2x"/></a>
                                            }
                                            {!this.state.activity?.is_favorited &&
                                            <a title={"Legg til favoritt"} className="text-success" role="button"
                                               onClick={this.favorite}><i
                                                className="far fa-heart fa-2x"/></a>
                                            }
                                        </>
                                        ||
                                        <a title={"Krever innlogging"} className="text-muted">
                                            <i className="far fa-heart fa-2x"/>
                                        </a>
                                        }
                                    </div>
                                    {!this.state.activity?.has_registration &&
                                    <>
                                        {this.props.authenticated &&
                                        <div className="d-flex align-items-center flex-column">
                                            <a title="Registrer gjennomføring" className="text-success" role="button"
                                               onClick={this.log}>
                                                <i className="far fa-check-circle fa-2x"/>
                                            </a>
                                        </div>
                                        ||
                                        <a title={"Krever innlogging"} className="text-muted">
                                            <i className="far fa-check-circle fa-2x"/>
                                        </a>
                                        }
                                    </>
                                    }
                                    {!this.state.activity?.is_author && stringIsEmail(this.state.author?.email) &&
                                    <>
                                        {this.props.authenticated &&
                                        <>
                                            {stringIsEmail(this.state.user?.email) &&
                                            <div className="d-flex align-items-center flex-column">
                                                <Link
                                                    to={`/activity/${this.state.activity?.id}/contact/`}
                                                    title={this.state.activity?.has_registration && "Kontakt arrangør" || "Kontakt forfatter"}
                                                    className="text-success"
                                                    role="button">
                                                    <i className="far fa-envelope fa-2x"/>
                                                </Link>
                                            </div>
                                            ||
                                            <a title={"Krever registrert e-post"} className="text-muted">
                                                <i className="far fa-envelope fa-2x"/>
                                            </a>
                                            }
                                        </>
                                        ||
                                        <a title={"Krever innlogging"} className="text-muted">
                                            <i className="far fa-envelope fa-2x"/>
                                        </a>
                                        }
                                    </>
                                    }
                                </div>
                            </div>
                            {(this.props.authenticated && this.state.activity?.is_author) &&
                            <Link to={`/activity/${this.state.activity.id}/edit`}>
                                <button className={"btn btn-outline-success w-100 mt-3 mb-1"}>
                                    Rediger
                                </button>
                            </Link>
                            }
                        </div>
                        <div className="col-12 col-md-7 ms-md-4 ms-xxl-5 mb-5">
                            <DetailedActivity activity={this.state.activity} authenticated={this.props.authenticated}/>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(ActivityDetails);
