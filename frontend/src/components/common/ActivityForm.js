import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import DateTimePicker from "../common/DateTimePicker"
import CategorySelect from "../common/CategorySelect";
import GalleryModal from "./GalleryModal";

class ActivityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            gallery_images: [],
            selected_gallery_image: null,
            selected_categories: [],
            deadline_datetime: null,
            start_datetime: null,
            image_preview: true
        };
        this.submit = this.submit.bind(this);
        this.onGalleryImageSelected = this.onGalleryImageSelected.bind(this);
    }

    /**
     * Retrieve all available categories
     */
    componentDidMount() {

        this.retrieveCategories();

        this.retrieveGalleryImages();

        this.attachImageInputListener();

        this.attachImageRemoveButtonListener();

    }

    /**
     * Retrieve all available categories
     */
    retrieveCategories() {
        axios
            .get('http://localhost:8000/api/categories/')
            .then(res => {
                // Create category dropdown options
                let categories = res.data.map((category) => {
                    return {label: category.title, value: category.id}
                });
                this.setState({categories: categories});
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    /**
     * Retrieve all available categories
     */
    retrieveGalleryImages() {
        axios
            .get('http://localhost:8000/api/images/')
            .then(res => {
                this.setState({gallery_images: res.data});
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    /**
     * Check if activity has been passed from parent, if so fill inputs with the values
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        if (prevProps.activity == null && this.props.activity != null) {
            this.fillActivity();
        }
    }

    /**
     * Fill inputs with activity data
     */
    fillActivity() {

        const activity = this.props.activity;

        document.getElementById("activity-title-input").value = activity.title;
        document.getElementById("activity-ingress-input").value = activity.ingress;
        document.getElementById("activity-description-input").value = activity.description;

        if (activity.image != null) {
            const imagePreview = document.getElementById("image-preview");
            const imagePreviewBtn = document.getElementById("image-preview-toggle");
            const imageRemoveBtn = document.getElementById("image-remove");
            imagePreview.src = activity.image;
            imagePreviewBtn.style.display = "inline-block";
            imageRemoveBtn.style.display = "inline-block";
            imagePreviewBtn.click();
        }

        const elements = ["registration-capacity", "registration-deadline", "starting_time", "location"];
        if (activity.has_registration) {
            elements.forEach(item => document.getElementById(item).style.display = "block");
            document.getElementById("registration-checkbox").checked = true;
            document.getElementById("registration-capacity-input").value = activity.registration_capacity;
            this.setState({deadline_datetime: new Date(activity.registration_deadline)})
            this.setState({start_datetime: new Date(activity.starting_time)})
            document.getElementById("activity-location-input").value = activity.location;
        } else {
            elements.forEach(item => document.getElementById(item).style.display = "none");
        }
        const selected = []
        for (const category of this.state.categories) {
            if (activity.categories.indexOf(category.value) !== -1) {
                selected.push(category)
            }
        }
        this.setState({selected_categories: selected})

    }

    /**
     * Add 'change' event listener to image file input
     */
    attachImageInputListener() {
        const imageUpload = document.getElementById('image-upload');
        imageUpload.oninput = () => {
            const image = imageUpload.files[0];
            const imageReader = new FileReader();
            imageReader.onload = (e) => {
                this.onImageSelected(e.target.result)
            }
            imageReader.readAsDataURL(image);
        }
    }

    /**
     * Handle preview and image buttons when an image has been selected (upload or gallery)
     * @param src: image location (url)
     */
    onImageSelected(src) {
        document.getElementById("image-preview").src = src;
        document.getElementById("image-preview-container").classList.add("show");
        this.setState({image_preview: true});
        document.getElementById("image-preview-toggle").style.display = "inline-block";
        document.getElementById("image-remove").style.display = "inline-block";
    }

    /**
     * Set activity image from gallery
     * @param id: id of selected image
     */
    onGalleryImageSelected(id) {
        this.setState({
            selected_gallery_image: id
        });
        // Get source url of image with given id
        const src = this.state.gallery_images.find((image) => image.id === id).image;
        // Reset image upload field
        document.getElementById('image-upload').value = "";
        this.onImageSelected(src);
    }

    /**
     * Define behaviour of button to remove image
     */
    attachImageRemoveButtonListener() {
        const imageUpload = document.getElementById('image-upload');
        const imagePreview = document.getElementById("image-preview");
        const imagePreviewCont = document.getElementById("image-preview-container");
        const imagePreviewBtn = document.getElementById("image-preview-toggle");
        const imageRemoveBtn = document.getElementById("image-remove");
        imageRemoveBtn.onclick = () => {
            imageUpload.value = "";
            imagePreviewCont.classList.remove("show");
            this.setState({image_preview: false, selected_gallery_image: null});
            imagePreview.src = "";
            imagePreviewBtn.style.display = "none";
            imageRemoveBtn.style.display = "none";
        }
    }

    /**
     * Create FormData object with the base input values (i.e. not registration)
     */
    retrieveBaseInputData() {
        const data = new FormData();
        data.append("title", document.getElementById("activity-title-input").value);
        data.append("ingress", document.getElementById("activity-ingress-input").value);
        data.append("description", document.getElementById("activity-description-input").value);
        this.state.selected_categories.forEach(category => data.append("categories", category.value));
        const imageUpload = document.getElementById('image-upload');
        if (imageUpload.files.length > 0) {
            data.append("image", document.getElementById('image-upload').files[0]);
        } else if (this.state.selected_gallery_image != null) {
            data.append("gallery_image", this.state.selected_gallery_image);
        }
        return data;
    }

    /**
     * Create FormData object with base input and registration values
     */
    retrieveBaseAndRegistrationInputData() {
        const data = this.retrieveBaseInputData();
        data.append("has_registration", "true");
        data.append("registration_capacity", document.getElementById("registration-capacity-input").value);
        data.append("registration_deadline", this.state.deadline_datetime.toISOString());
        data.append("starting_time", this.state.start_datetime.toISOString());
        data.append("location", document.getElementById("activity-location-input").value);
        return data;
    }

    /**
     * Checks whether or not the registration checkbox is checked.
     * Then we display the rest of the form.
     */
    displayRegistrationForm() {
        const elements = ["registration-capacity", "registration-deadline", "starting_time", "location"];
        if (document.getElementById("registration-checkbox").checked) {
            elements.forEach(item => document.getElementById(item).style.display = "block");
        } else {
            elements.forEach(item => document.getElementById(item).style.display = "none");
        }
    }

    submit() {
        const registration = document.getElementById("registration-checkbox").checked ? true : false;
        if (registration) {
            this.props.onSubmit(this.retrieveBaseAndRegistrationInputData());
        } else {
            const data = this.retrieveBaseInputData();
            data.append("has_registration", "false");
            this.props.onSubmit(data);
        }
    }

    render() {

        return (
            <>
                <div className="row" id="activity-form">
                    {/*Title */}
                    <div className="mt-3 mb-4">
                        <label htmlFor="activity-title-input" className="form-label h5 mb-3">Tittel</label>
                        <input id="activity-title-input" type="text" className="form-control"
                               placeholder="Joggetur" required/>
                    </div>
                    {/*Ingress */}
                    <div className="mb-4">
                        <label htmlFor="activity-ingress-input" className="form-label h5 mb-3">Ingress</label>
                        <input className="form-control" id="activity-ingress-input" type="text" required
                               placeholder={"Joggetur fra Gløshaugen til Heimdal."}/>
                    </div>
                    {/*Description */}
                    <div className="mb-4">
                        <label htmlFor="activity-description-input" className="form-label h5 mb-3">Beskrivelse</label>
                        <textarea className="form-control" id="activity-description-input" rows="3" required
                                  placeholder={"Solid joggetur på 8 km. Terrenget er nokså flatt. Anbefaler å ligge på rundt 7 km/t."}/>
                    </div>
                    {/*Categories */}
                    <div className="mb-4">
                        <label htmlFor="activity-categories-input" className="form-label h5 mb-3">Kategorier</label>
                        <CategorySelect
                            id="activity-categories-input"
                            categories={this.state.categories}
                            selected_categories={this.state.selected_categories}
                            onChange={(selected) => this.setState({selected_categories: selected})}
                        />
                    </div>
                    {/*Image */}
                    <div className="mb-4">
                        <label htmlFor="image-upload" className="form-label h5 mb-3">Bilde</label>
                        <input className="form-control" type="file" id="image-upload" accept="image/*"/>
                        <div id={"image-preview-container"} className={"collapse"}>
                            <img id={"image-preview"} className={"mt-3 rounded img-fluid"} alt={"Ugyldig bilde"}/>
                        </div>
                        <p className={"mt-3"}>
                            <button id={"image-preview-toggle"} className="btn btn-outline-secondary me-2"
                                    type="button"
                                    data-bs-toggle="collapse" style={{display: "none"}}
                                    data-bs-target="#image-preview-container" aria-expanded="false"
                                    aria-controls="image-preview-container"
                                    onClick={() => this.setState({image_preview: !this.state.image_preview})}>
                                {this.state.image_preview === true ? "Skjul forhåndsvisning" : "Vis forhåndsvisning"}
                            </button>
                            <button id={"image-remove"} className="btn btn-outline-danger"
                                    style={{display: "none"}}>Fjern bilde
                            </button>
                        </p>
                        <button type="button" className="btn btn-outline-success" data-bs-toggle="modal"
                                data-bs-target="#galleryModal">
                            Velg fra bildegalleri
                        </button>
                        <GalleryModal id={"galleryModal"} images={this.state.gallery_images}
                                      onImageSelected={this.onGalleryImageSelected}/>
                    </div>
                    {/*Registration checkbox */}
                    <div className={"mt-3"}>
                        <label className="form-label h5 mb-3">Påmelding</label>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                   onClick={this.displayRegistrationForm} id="registration-checkbox"/>
                            <label className="form-check-label" htmlFor="registration-checkbox">Aktivitet har
                                påmelding</label>
                        </div>
                    </div>
                    {/*Capacity */}
                    <div id="registration-capacity" style={{display: "none"}} className="mb-3">
                        <br/>
                        <label className="form-label">Antall plasser</label>
                        <input type="number" min={1} className="form-control" id="registration-capacity-input"
                               required/>
                    </div>
                    {/*Reg deadline date */}
                    <div id="registration-deadline" style={{display: "none"}} className="mb-3">
                        <label htmlFor="start-date" className="form-label">Påmeldingsfrist</label>
                        <br/>
                        <DateTimePicker
                            selected={this.state.deadline_datetime}
                            onChange={date => this.setState({deadline_datetime: date})}
                        />
                    </div>
                    {/*Date */}
                    <div id="starting_time" style={{display: "none"}} className="mb-3">
                        <label htmlFor="start-date" className="form-label">Starttidspunkt</label>
                        <br/>
                        <DateTimePicker
                            selected={this.state.start_datetime}
                            onChange={date => this.setState({start_datetime: date})}
                        />
                    </div>
                    {/*Location */}
                    <div id="location" style={{display: "none"}} className="mb-3">
                        <label htmlFor="activity-location" className="form-label">Sted</label>
                        <input id="activity-location-input" type="text" className="form-control"
                               placeholder="Gløshaugen" required/>
                    </div>
                </div>
                <div className="mt-5 row">
                    <div className={"d-none d-md-block col-4 pe-4"}>
                        <button className="btn btn-outline-secondary w-100"
                                onClick={this.props.history.goBack}>Avbryt
                        </button>
                    </div>
                    <div className={"col"}>
                        <button className="btn btn-success w-100" onClick={this.submit}>{this.props.submitText}</button>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(ActivityForm);
