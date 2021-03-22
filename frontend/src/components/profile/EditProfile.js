import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import ImageUpload from "../common/ImageUpload";

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
            uploaded_image: null
        };
        this.edit = this.edit.bind(this);
        this.onImageUploaded = this.onImageUploaded.bind(this);
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

    /**
     * Handle new image upload
     * @param file: image file
     */
    onImageUploaded(file) {
        this.setState({uploaded_image:file})
    }

    /**
     * Sends a PUT the the server, with the updated data for the user.
     */
    edit() {
        const data = new FormData();
        data.append("username",document.getElementById("edit-username").value);
        data.append("phone_number", document.getElementById("edit-phone").value);
        data.append("email", document.getElementById("edit-email").value);
        if (this.state.uploaded_image != null) {
            data.append("avatar", this.state.uploaded_image);
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
                    </div>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="activity-description-input" className="form-label h5 mb-3">Epost</label>
                        <input id="edit-email" type="email" className="form-control"/>
                    </div>
                    {/* Phone number */}
                    <div className="mb-4">
                        <label htmlFor="activity-description-input" className="form-label h5 mb-3">Telefonnummer</label>
                        <input id="edit-phone" type="text" className="form-control" required maxLength={11}/>
                    </div>
                    {/*Image */}
                    <div className="mb-4">
                        <label htmlFor="profile-avatar-image-upload" className="form-label h5 mb-3">Bilde</label>
                        <ImageUpload id="profile-avatar-image-upload" image={this.state.data.avatar} onImageUploaded={this.onImageUploaded} />
                    </div>
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