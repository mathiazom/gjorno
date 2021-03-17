import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import ImageUpload from "../common/ImageUpload";
import {stringIsBlank, stringIsEmail, validateForm} from "../common/Utils";

class EditProfile extends React.Component {

    /**
     * Component to edit the information stored about a user.
     *
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            image: null
        };
        this.edit = this.edit.bind(this);
    }

    /**
     * Collect the current user based on the token stored in the websites localStorage.
     * Set the different fields to contain the data collected.
     */
    componentDidMount() {
        axios.get('http://localhost:8000/api/current_user/',
            {
                headers: {
                    "Authorization": `Token ${window.localStorage.getItem("Token")}`
                }
            })
            .then(res => {
                this.setState({data: res.data})
                document.getElementById("edit-username").value = this.state.data.username;
                document.getElementById("edit-phone").value = this.state.data.phone_number;
                document.getElementById("edit-email").value = this.state.data.email;
            }).catch(error => {
            console.log(error.response);
        })
    }

    profileInputFormRules() {

        const usernameInput = document.getElementById("edit-username");
        const phoneInput = document.getElementById("edit-phone");
        const emailInput = document.getElementById("edit-email");

        return [
            {
                inputEl: usernameInput,
                rules: [
                    {
                        isValid: !stringIsBlank(usernameInput.value),
                        msg: "Brukernavn er obligatorisk"
                    }
                ]
            },{
                inputEl: phoneInput,
                rules: [
                    {
                        isValid: phoneInput.value.length <= 11,
                        msg: "Ugyldig telefonnummer"
                    }
                ]
            },{
                inputEl: emailInput,
                rules: [
                    {
                        isValid: stringIsBlank(emailInput.value) ||
                                 stringIsEmail(emailInput.value),
                        msg: "Ugyldig e-post"
                    }
                ]
            },
        ]

    }

    /**
     * Sends a PUT the the server, with the updated data for the user.
     */
    edit() {
        if(!validateForm(this.profileInputFormRules())){
            // At least one invalid input value, abort
            return;
        }
        const data = new FormData();
        data.append("username",document.getElementById("edit-username").value);
        data.append("phone_number", document.getElementById("edit-phone").value);
        data.append("email", document.getElementById("edit-email").value);
        if (this.state.image != null) {
            data.append("avatar", this.state.image);
        } else {
            // Send an empty file to clear any existing avatar
            data.append("avatar", new File([], ''))
        }
        axios.put("http://localhost:8000/api/current_user/", data, {
            headers: {
                "Authorization": `Token ${window.localStorage.getItem("Token")}`
            }
        }).then(() => {
            this.props.history.push("/profile/");
        }).catch(error => {
            console.log(error.response);
        })
    }

    render() {
        return (
            <div className="container-fluid w-50 m-5 mx-auto">
                <h1>Rediger profil</h1>
                <div className="row">
                    {/* Username */}
                    <div className="mt-3 mb-4">
                        <label htmlFor="Username" className="form-label h5 mb-3">Brukernavn</label>
                        <input id="edit-username" type="text" className="form-control" required/>
                        <div className={"invalid-feedback"}/></div>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="activity-description-input" className="form-label h5 mb-3">Epost</label>
                        <input id="edit-email" type="email" className="form-control"/>
                        <div className={"invalid-feedback"}/></div>
                    {/* Phone number */}
                    <div className="mb-4">
                        <label htmlFor="activity-description-input" className="form-label h5 mb-3">Telefonnummer</label>
                        <input id="edit-phone" type="text" className="form-control" required maxLength={11}/>
                        <div className={"invalid-feedback"}/></div>
                    {/*Image */}
                    <div className="mb-4">
                        <label htmlFor="profile-avatar-image-upload" className="form-label h5 mb-3">Bilde</label>
                        <ImageUpload id="profile-avatar-image-upload" image={this.state.data.avatar} 
                                     omImageChanged={(image) => this.setState({image: image})} />
                        <div className={"invalid-feedback"}/></div>
                </div>
                <div className="mt-3 row">
                    <div className={"d-none d-md-block col-4 pe-4"}>
                        <button className="btn btn-outline-secondary w-100" onClick={this.props.history.goBack}>Avbryt
                        </button>
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