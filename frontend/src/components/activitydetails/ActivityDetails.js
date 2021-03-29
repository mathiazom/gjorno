import React from 'react';
import axios from 'axios';
import ActivityHost from "./ActivityHost.js";
import DetailedActivity from "./DetailedActivity.js";
import Registration from "./Registration.js";
import {Link, withRouter} from 'react-router-dom';

class ActivityDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activity: [],
            user: []
        };
        this.getActivity = this.getActivity.bind(this);
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

    render() {
        let join;
        if (this.state.activity.has_registration === true) {
            join = <Registration activity={this.state.activity} onUpdate={this.getActivity}
                                 authenticated={this.props.authenticated}/>
        } else if (this.props.authenticated) {
            if (this.state.activity.is_author === false){
              join = <a href="#" className="btn btn-success w-100 mt-3">Legg i logg</a>
            } else {
              join = (
                  <Link to={`/edit-activity/${this.state.activity.id}`}>
                      <button id={"edit-button"} className={"btn btn-outline-success w-100 mt-3 mb-1"}>Rediger</button>
                  </Link>
              )
            }
        }
        let img = this.state.activity.image;
        return (
            <>
                {img == null || <img src={img} className="img-fluid activity-details-banner" alt={"Aktivitetsbilde"}/>}
                <div className="container-fluid w-100 mt-5" style={{marginBottom:"300px"}}>
                    <div className="row">
                        <div className="col col-md-2 offset-sm-1">
                            <ActivityHost userdata={this.state.user}/>
                            <div className="card profileInfo mt-2">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Aktivitetinfo</h5>
                                    {this.state.activity.activity_level &&
                                        (<>
                                            <div><b>Nivå</b></div>
                                            <label className="card-text mb-2">
                                                {["Lett","Moderat","Krevende"][this.state.activity.activity_level-1]}
                                            </label>
                                        </>)
                                    }
                                    {join}
                                </div>
                            </div>
                        </div>
                        <div className="col col-md-7 offset-sm-1">
                            <DetailedActivity activity={this.state.activity}/>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(ActivityDetails);
