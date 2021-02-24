import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";

class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/current_user/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }})
            .then(res => {
                this.setState({data: res.data})
                document.getElementById("edit-username").value = this.state.data.username;
                document.getElementById("edit-phone").value = this.state.data.phone_number;
                document.getElementById("edit-email").value = this.state.data.email;
            }).catch(error => {
                console.log(error.response);
            })
    }

    edit() {
        const user = { 
            "username": document.getElementById("edit-username").value,
            "phone_number": document.getElementById("edit-phone").value,
            "email": document.getElementById("edit-email").value
        };
        axios.put("http://localhost:8000/api/current_user/", user, {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }}).then(() => {
                this.props.history.push("/profile/");
            }).catch(error => {
                console.log(error.response);
            })
        }

    render() {
        return(
            <div className="container-fluid w-50 m-5 mx-auto">
                <h1>Rediger profil</h1>
                <div className="row">
                    
                    <div className="mt-3 mb-3">
                        <label htmlFor="Username" className="form-label">Brukernavn</label>
                        <input id="edit-username" type="text" className="form-control" required/>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="activity-description-input" className="form-label">Epost</label>
                        <input id="edit-email" type="email" className="form-control"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="activity-description-input" className="form-label">Telefonnummer</label>
                        <input id="edit-phone" type="text" className="form-control" required maxLength={11}/>
                    </div>

                </div>

                <div className="mt-3 row">
                    <div className={"d-none d-md-block col-4 pe-4"}>
                        <button className="btn btn-outline-secondary w-100" onClick={this.props.history.goBack}>Avbryt</button>
                    </div>
                    <div className={"col"}>
                        <button className="btn btn-success w-100" onClick={this.edit}>Lagre</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(EditProfile);
