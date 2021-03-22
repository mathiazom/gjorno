import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import DateTimePicker from "../common/DateTimePicker"
import CategorySelect from "../common/CategorySelect";
// import GalleryModal from "./GalleryModal";
import ImageUpload from "./ImageUpload";

class ActivityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            uploaded_image: null,
            selected_gallery_image: null,
            selected_categories: [],
            deadline_datetime: null,
            start_datetime: null
        };
        this.submit = this.submit.bind(this);
        this.onImageUploaded = this.onImageUploaded.bind(this);
        this.onGalleryImageSelected = this.onGalleryImageSelected.bind(this);
    }

    /**
     * Retrieve all available categories
     */
    componentDidMount() {

        this.retrieveCategories();

        // Show registration inputs if activity has registration, hide otherwise
        this.displayRegistrationForm();

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

        if (activity.has_registration) {
            document.getElementById("registration-inputs").style.display = "block";
            document.getElementById("registration-checkbox").checked = true;
            document.getElementById("registration-capacity-input").value = activity.registration_capacity;
            this.setState({deadline_datetime: new Date(activity.registration_deadline)})
            this.setState({start_datetime: new Date(activity.starting_time)})
            document.getElementById("activity-location-input").value = activity.location;
        } else {
            document.getElementById("registration-inputs").style.display = "none";
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
     * Handle new image upload
     * @param file: image file
     */
    onImageUploaded(file) {
        this.setState({uploaded_image:file})
    }

    /**
     * Set activity image from gallery
     * @param id: id of selected image
     */
    onGalleryImageSelected(id) {
        this.setState({
            selected_gallery_image: id
        });
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
        if (this.state.selected_gallery_image != null) {
            data.append("gallery_image", this.state.selected_gallery_image);
        } else if (this.state.uploaded_image != null) {
            data.append("image", this.state.uploaded_image);
        } else {
            // Send an empty file to clear any existing image
            data.append("image", new File([], ''))
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
        if (document.getElementById("registration-checkbox").checked) {
            document.getElementById("registration-inputs").style.display = "block";
        } else {
            document.getElementById("registration-inputs").style.display = "none";
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
                               placeholder="Joggetur" required value={this.props.activity?.title}/>
                    </div>
                    {/*Ingress */}
                    <div className="mb-4">
                        <label htmlFor="activity-ingress-input" className="form-label h5 mb-3">Ingress</label>
                        <input className="form-control" id="activity-ingress-input" type="text" required
                               placeholder={"Joggetur fra Gløshaugen til Heimdal."} value={this.props.activity?.ingress}/>
                    </div>
                    {/*Description */}
                    <div className="mb-4">
                        <label htmlFor="activity-description-input" className="form-label h5 mb-3">Beskrivelse</label>
                        <textarea className="form-control" id="activity-description-input" rows="3" required
                                  value={this.props.activity?.description}
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
                        <label htmlFor="activity-image-upload" className="form-label h5 mb-3">Bilde</label>
                        <ImageUpload id="activity-image-upload" image={this.props.activity?.image} onImageUploaded={this.onImageUploaded} onGalleryImageSelected={this.onGalleryImageSelected} withGallery/>
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
                    {/*Registration options */}
                    <div id={"registration-inputs"}>
                        {/*Capacity */}
                        <div id="registration-capacity" className="mb-3">
                            <br/>
                            <label className="form-label">Antall plasser</label>
                            <input type="number" min={1} className="form-control" id="registration-capacity-input"
                                   required/>
                        </div>
                        {/*Reg deadline date */}
                        <div id="registration-deadline" className="mb-3">
                            <label htmlFor="start-date" className="form-label">Påmeldingsfrist</label>
                            <br/>
                            <DateTimePicker
                                selected={this.state.deadline_datetime}
                                onChange={date => this.setState({deadline_datetime: date})}
                            />
                        </div>
                        {/*Date */}
                        <div id="starting_time" className="mb-3">
                            <label htmlFor="start-date" className="form-label">Starttidspunkt</label>
                            <br/>
                            <DateTimePicker
                                selected={this.state.start_datetime}
                                onChange={date => this.setState({start_datetime: date})}
                            />
                        </div>
                        {/*Location */}
                        <div id="location" className="mb-3">
                            <label htmlFor="activity-location" className="form-label">Sted</label>
                            <input id="activity-location-input" type="text" className="form-control"
                                   placeholder="Gløshaugen" required/>
                        </div>
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
