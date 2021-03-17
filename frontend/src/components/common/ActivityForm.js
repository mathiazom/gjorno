import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import DateTimePicker from "../common/DateTimePicker"
import CategorySelect from "../common/CategorySelect";
import ImageUpload from "./ImageUpload";
import {validateForm, stringIsBlank} from "./Utils";

class ActivityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            image: null,
            selectedCategories: [],
            deadlineDatetime: null,
            startDatetime: null
        };
        this.submit = this.submit.bind(this);
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

        document.getElementById("activity-title-input").value = activity.title;
        document.getElementById("activity-ingress-input").value = activity.ingress;
        document.getElementById("activity-description-input").value = activity.description;

        if (activity.has_registration) {
            document.getElementById("registration-inputs").style.display = "block";
            document.getElementById("registration-checkbox").checked = true;
            document.getElementById("registration-capacity-input").value = activity.registration_capacity;
            this.setState({deadlineDatetime: new Date(activity.registration_deadline)})
            this.setState({startDatetime: new Date(activity.starting_time)})
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
        this.setState({selectedCategories: selected})

    }

    /**
     * Validation rules for the base inputs
     */
    baseInputFormRules() {

        const titleInput = document.getElementById("activity-title-input");
        const ingressInput = document.getElementById("activity-ingress-input");
        const descriptionInput = document.getElementById("activity-description-input");
        const categoriesInput = document.getElementById("activity-categories-input");
        const activityImageUpload = document.getElementById("activity-image-upload");

        return [
            {
                inputEl: titleInput,
                rules: [
                    {
                        isValid: !stringIsBlank(titleInput.value),
                        msg: "Tittel er obligatorisk"
                    },
                    {
                        isValid: titleInput.value.length <= 50,
                        msg: "Tittel kan ikke være lengre enn 50 tegn"
                    }
                ]
            }, {
                inputEl: ingressInput,
                rules: [
                    {
                        isValid: !stringIsBlank(ingressInput.value),
                        msg: "Ingress er obligatorisk"
                    },
                    {
                        isValid: ingressInput.value.length <= 240,
                        msg: "Ingress kan ikke være lengre enn 240 tegn"
                    }
                ]
            }, {
                inputEl: descriptionInput,
                rules: [
                    {
                        isValid: !stringIsBlank(descriptionInput.value),
                        msg: "Beskrivelse er obligatorisk"
                    }
                ]
            }, {
                inputEl: categoriesInput,
                rules: [
                    {
                        isValid: this.state.selectedCategories.length > 0,
                        msg: "Velg minst én kategori"
                    }
                ]
            }, {
                inputEl: activityImageUpload,
                rules: [
                    {
                        isValid: this.state.image == null ||
                            ('image' in this.state.image && this.state.image.image != null
                            || 'gallery_image' in this.state.image && this.state.image.gallery_image != null),
                        msg: "Velg et gyldig bilde, eller fjern det"
                    }
                ]
            }
        ];

    }

    /**
     * Validation rules for both base and registration inputs
     */
    baseAndRegistrationInputFormRules() {

        const capacityInput = document.getElementById("registration-capacity-input");
        const locationInput = document.getElementById("activity-location-input");
        const deadlineInput = document.getElementById("registration-deadline-input");
        const startingTimeInput = document.getElementById("starting-time-input");

        return this.baseInputFormRules().concat([
            {
                inputEl: capacityInput,
                rules: [
                    {
                        isValid: !stringIsBlank(capacityInput.value),
                        msg: "Antall plasser er obligatorisk"
                    },
                    {
                        isValid: stringIsBlank(capacityInput.value) || capacityInput.value > 0,
                        msg: "Antall plasser må være større enn 0"
                    }
                ]
            }, {
                inputEl: deadlineInput,
                feedbackEl: document.getElementById("registration-deadline-feedback"),
                rules: [
                    {
                        isValid: this.state.deadlineDatetime != null,
                        msg: "Påmeldingsfrist er obligatorisk"
                    },
                    {
                        isValid: this.state.startDatetime == null ||
                            this.state.deadlineDatetime == null ||
                            this.state.deadlineDatetime < this.state.startDatetime,
                        msg: "Påmeldingsfrist kan ikke være etter starttidspunkt"
                    }, {
                        isValid: this.state.deadlineDatetime == null ||
                            this.state.deadlineDatetime >= new Date(),
                        msg: "Påmeldingsfrist kan ikke være i fortiden"
                    }
                ]
            }, {
                inputEl: startingTimeInput,
                feedbackEl: document.getElementById("starting-time-feedback"),
                rules: [
                    {
                        isValid: this.state.startDatetime != null,
                        msg: "Starttidspunkt er obligatorisk"
                    }, {
                        isValid: this.state.startDatetime == null ||
                            this.state.startDatetime >= new Date(),
                        msg: "Starttidspunkt kan ikke være i fortiden"
                    }
                ]
            }, {
                inputEl: locationInput,
                rules: [
                    {
                        isValid: !stringIsBlank(locationInput.value),
                        msg: "Sted er obligatorisk"
                    }
                ]
            }
        ]);

    }


    /**
     * Create FormData object with the base input values (i.e. not registration)
     */
    retrieveBaseInputData() {
        const data = new FormData();
        data.append("title", document.getElementById("activity-title-input").value);
        data.append("ingress", document.getElementById("activity-ingress-input").value);
        data.append("description", document.getElementById("activity-description-input").value);
        this.state.selectedCategories.forEach(category => data.append("categories", category.value));
        const image = this.state.image;
        if (image != null){
            if ('image' in image){
                data.append("image", image.image);
            }else if ('gallery_image' in image){
                data.append("gallery_image", image.gallery_image);
            }
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
        data.append("registration_deadline", this.state.deadlineDatetime.toISOString());
        data.append("starting_time", this.state.startDatetime.toISOString());
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
            if (!validateForm(this.baseAndRegistrationInputFormRules())) {
                // At least one invalid input value, abort
                return;
            }
            this.props.onSubmit(this.retrieveBaseAndRegistrationInputData());
        } else {
            if (!validateForm(this.baseInputFormRules())) {
                // At least one invalid input value, abort
                return;
            }
            const data = this.retrieveBaseInputData();
            data.append("has_registration", "false");
            this.props.onSubmit(data);
        }
    }

    render() {

        return (
            <>
                <form className="row needs-validation" id="activity-form" noValidate>
                    {/*Title */}
                    <div className="mt-3 mb-4">
                        <label htmlFor="activity-title-input" className="form-label h5 mb-3">Tittel</label>
                        <input id="activity-title-input" type="text" className="form-control"
                               placeholder="Joggetur" />
                        <div className={"invalid-feedback"}/>
                    </div>
                    {/*Ingress */}
                    <div className="mb-4">
                        <label htmlFor="activity-ingress-input" className="form-label h5 mb-3">Ingress</label>
                        <input className="form-control" id="activity-ingress-input" type="text"
                               placeholder={"Joggetur fra Gløshaugen til Heimdal."} />
                        <div className={"invalid-feedback"}/>
                    </div>
                    {/*Description */}
                    <div className="mb-4">
                        <label htmlFor="activity-description-input" className="form-label h5 mb-3">Beskrivelse</label>
                        <textarea className="form-control" id="activity-description-input" rows="3"
                                  placeholder={"Solid joggetur på 8 km. Terrenget er nokså flatt. Anbefaler å ligge på rundt 7 km/t."}/>
                        <div className={"invalid-feedback"}/>
                    </div>
                    {/*Categories */}
                    <div className="mb-4">
                        <label htmlFor="activity-categories-input" className="form-label h5 mb-3">Kategorier</label>
                        <CategorySelect
                            id="activity-categories-input"
                            categories={this.state.categories}
                            selectedCategories={this.state.selectedCategories}
                            onChange={(selected) => this.setState({selectedCategories: selected})}
                        />
                        <div className={"invalid-feedback"}/>
                    </div>
                    {/*Image */}
                    <div className="mb-4">
                        <label htmlFor="activity-image-upload" className="form-label h5 mb-3">Bilde</label>
                        <ImageUpload id="activity-image-upload" image={this.props.activity?.image}
                                     onImageChanged={(image) => this.setState({"image": image})}
                                     withGallery/>
                        <div className={"invalid-feedback"}/>
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
                            <input type="number" min={1} className="form-control" id="registration-capacity-input"/>
                            <div className={"invalid-feedback"}/>
                        </div>
                        {/*Reg deadline date */}
                        <div id="registration-deadline" className="mb-3">
                            <label htmlFor="start-date" className="form-label">Påmeldingsfrist</label>
                            <br/>
                            <DateTimePicker
                                id={"registration-deadline-input"}
                                selected={this.state.deadlineDatetime}
                                onChange={date => this.setState({deadlineDatetime: date})}
                            />
                            <div id="registration-deadline-feedback" className={"invalid-feedback"}/>
                        </div>
                        {/*Date */}
                        <div id="starting_time" className="mb-3">
                            <label htmlFor="start-date" className="form-label">Starttidspunkt</label>
                            <br/>
                            <DateTimePicker
                                id={"starting-time-input"}
                                selected={this.state.startDatetime}
                                onChange={date => this.setState({startDatetime: date})}
                            />
                            <div id="starting-time-feedback" className={"invalid-feedback"}/>
                        </div>
                        {/*Location */}
                        <div id="location" className="mb-3">
                            <label htmlFor="activity-location" className="form-label">Sted</label>
                            <input id="activity-location-input" type="text" className="form-control"
                                   placeholder="Gløshaugen"/>
                            <div className={"invalid-feedback"}/>
                        </div>
                    </div>
                </form>
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
