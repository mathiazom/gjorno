import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import ImageUpload from "../common/ImageUpload";
import {stringIsBlank, stringIsEmail, stringIsPhoneNumber, updatePageTitle, validateForm} from "../common/Utils";
import FormWithValidation from "../common/FormWithValidation";
import FormPage from "../common/FormPage";

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
            avatar: null
        };
        this.edit = this.edit.bind(this);
    }

    /**
     * Collect the current user based on the token stored in the websites localStorage.
     * Set the different fields to contain the data collected.
     */
    componentDidMount() {
        updatePageTitle("Rediger profil");
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
        });
    }

    /**
     * Collection of rules for validating input data from edit profile form
     */
    profileInputFormRules() {

        const usernameInput = document.getElementById("edit-username");
        const phoneInput = document.getElementById("edit-phone");
        phoneInput.value = phoneInput.value.replaceAll(" ","");
        const emailInput = document.getElementById("edit-email");
        const avatarUpload = document.getElementById("profile-avatar-image-upload");

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
                        isValid: stringIsBlank(phoneInput.value) ||
                                 stringIsPhoneNumber(phoneInput.value),
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
            },{
                inputEl: avatarUpload,
                rules: [
                    {
                        isValid: this.state.image == null ||
                            ('image' in this.state.image && this.state.image.image != null),
                        msg: "Velg et gyldig bilde, eller fjern det"
                    }
                ]
            }
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
        if (this.state.avatar != null && 'image' in this.state.avatar && this.state.avatar.image != null) {
            data.append("avatar", this.state.avatar.image);
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
            <FormPage>
                <h1>Rediger profil</h1>
                <FormWithValidation submit={this.edit} submitText={"Lagre"}>
                    {/* Username */}
                    <div className="mt-3 mb-4">
                        <label htmlFor="edit-username" className="form-label h5 mb-3">Brukernavn</label>
                        <input id="edit-username" type="text" className="form-control"/>
                        <div className={"invalid-feedback"}/>
                    </div>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="edit-email" className="form-label h5 mb-3">Epost</label>
                        <input id="edit-email" type="email" className="form-control"/>
                        <div className={"invalid-feedback"}/>
                    </div>
                    {/* Phone number */}
                    <div className="mb-4">
                        <label htmlFor="edit-phone" className="form-label h5 mb-3">Telefonnummer</label>
                        <input id="edit-phone" type="text" className="form-control"/>
                        <div className={"invalid-feedback"}/>
                    </div>
                    {/*Image */}
                    <div className="mb-4">
                        <label htmlFor="profile-avatar-image-upload" className="form-label h5 mb-3">Bilde</label>
                        <ImageUpload id="profile-avatar-image-upload" image={this.state.data?.avatar}
                                     onImageChanged={(image) => this.setState({avatar: image})} />
                        <div className={"invalid-feedback"}/>
                    </div>
                </FormWithValidation>
            </FormPage>
        );
    }
}

export default withRouter(EditProfile);