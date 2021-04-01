import React from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import DateTimePicker from "../common/DateTimePicker"
import CategorySelect from "../common/CategorySelect";
import ImageUpload from "./ImageUpload";
import {validateForm, stringIsBlank, stringIsPositiveFloat} from "./Utils";
import FormWithValidation from "./FormWithValidation";
import {RequiredAsterisk} from "./RequiredAsterisk";

class ActivityForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            image: null,
            selected_categories: [],
            deadline_datetime: null,
            start_datetime: null
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
            .get('https://api.gjorno.site/api/categories/')
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
        document.getElementById("activity-level-input").value = activity.activity_level ? activity.activity_level : 0;
        document.getElementById("registration-price-input").value = activity.price;

        if (activity.has_registration) {
            document.getElementById("registration-checkbox").checked = true;
            this.displayRegistrationForm();
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
                        isValid: this.state.selected_categories.length > 0,
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
        const priceInput = document.getElementById("registration-price-input");
        const locationInput = document.getElementById("activity-location-input");
        const deadlineInput = document.getElementById("registration-deadline");
        const startingTimeInput = document.getElementById("starting-time");

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
            },{
                inputEl: priceInput,
                rules: [
                    {
                        isValid: stringIsBlank(priceInput.value) || stringIsPositiveFloat(priceInput.value),
                        msg: "Pris må være gyldig tall større enn 0, eller utelatt"
                    }
                ]
            }, {
                inputEl: deadlineInput,
                feedbackEl: document.getElementById("registration-deadline-feedback"),
                rules: [
                    {
                        isValid: this.state.deadline_datetime != null,
                        msg: "Påmeldingsfrist er obligatorisk"
                    },
                    {
                        isValid: this.state.start_datetime == null ||
                            this.state.deadline_datetime == null ||
                            this.state.deadline_datetime < this.state.start_datetime,
                        msg: "Påmeldingsfrist kan ikke være etter starttidspunkt"
                    }, {
                        isValid: this.state.deadline_datetime == null ||
                            this.state.deadline_datetime >= new Date(),
                        msg: "Påmeldingsfrist kan ikke være i fortiden"
                    }
                ]
            }, {
                inputEl: startingTimeInput,
                feedbackEl: document.getElementById("starting-time-feedback"),
                rules: [
                    {
                        isValid: this.state.start_datetime != null,
                        msg: "Starttidspunkt er obligatorisk"
                    }, {
                        isValid: this.state.start_datetime == null ||
                            this.state.start_datetime >= new Date(),
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
        this.state.selected_categories.forEach(category => data.append("categories", category.value))
        const level = document.getElementById("activity-level-input").value;
        if (1 <= level && level <= 3){
            data.append("activity_level", level);
        }else {
            data.append("activity_level", "");
        }
        data.append("price", document.getElementById("registration-price-input").value);
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
            <FormWithValidation submit={this.submit} submitText={this.props.submitText}>
                {/*Title */}
                <div className="mt-3 mb-4">
                    <label htmlFor="activity-title-input" className="form-label h5 mb-3">Tittel<RequiredAsterisk/></label>
                    <input id="activity-title-input" type="text" className="form-control"
                           placeholder="Joggetur" />
                    <div className={"invalid-feedback"}/>
                </div>
                {/*Ingress */}
                <div className="mb-4">
                    <label htmlFor="activity-ingress-input" className="form-label h5 mb-3">Ingress<RequiredAsterisk/></label>
                    <input id="activity-ingress-input" className="form-control" type="text"
                           placeholder={"Joggetur fra Gløshaugen til Heimdal."} />
                    <div className={"invalid-feedback"}/>
                </div>
                {/*Description */}
                <div className="mb-4">
                    <label htmlFor="activity-description-input" className="form-label h5 mb-3">Beskrivelse<RequiredAsterisk/></label>
                    <textarea id="activity-description-input" className="form-control" rows="5"
                              placeholder={"Solid joggetur på 8 km. Terrenget er nokså flatt. Anbefaler å ligge på rundt 7 km/t."}/>
                    <div className={"invalid-feedback"}/>
                </div>
                {/*Categories */}
                <div className="mb-4">
                    <label htmlFor="activity-categories-input" className="form-label h5 mb-3">Kategorier<RequiredAsterisk/></label>
                    <CategorySelect
                        id="activity-categories-input"
                        categories={this.state.categories}
                        selected_categories={this.state.selected_categories}
                        onChange={(selected) => this.setState({selected_categories: selected})}
                    />
                    <div className={"invalid-feedback"}/>
                </div>
                {/*Activity level */}
                <div id="registration-capacity" className="mb-4">
                    <label htmlFor="activity-level-input" className="form-label h5 mb-3">Aktivitetsnivå</label>
                    <select id="activity-level-input" className="form-select" aria-label="Velg aktivitetsnivå" defaultValue={"0"}>
                        <option value="0">Velg aktivitetsnivå</option>
                        <option value="1">Lett</option>
                        <option value="2">Moderat</option>
                        <option value="3">Krevende</option>
                    </select>
                    <div className={"invalid-feedback"}/>
                </div>
                {/*Image */}
                <div className="mb-4">
                    <label htmlFor="activity-image-upload" className="form-label h5 mb-3">Bilde</label>
                    <ImageUpload id="activity-image-upload" image={this.props.activity?.image}
                                 onImageChanged={(image) => this.setState({image: image})}
                                 withGallery/>
                    <div className={"invalid-feedback"}/>
                </div>
                {/*Registration checkbox */}
                <div className={"mt-3" + (this.props.disableHasRegistration && !this.props.activity?.has_registration && " d-none" || "")}>
                    <label className="form-label h5 mb-3">Påmelding</label>
                    <div className="form-check"
                         title={this.props.disableHasRegistration && "Kan ikke endres etter at aktivitet er opprettet"}>
                        {console.log(this.props)}
                        <input className="form-check-input" type="checkbox"
                               onClick={this.displayRegistrationForm} id="registration-checkbox"
                               disabled={this.props.disableHasRegistration}
                        />
                        <label className="form-check-label" htmlFor="registration-checkbox">Aktivitet har
                            påmelding</label>
                    </div>
                </div>
                {/*Registration options */}
                <div id={"registration-inputs"}>
                    {/*Capacity */}
                    <div id="registration-capacity" className="mb-3 mt-3">
                        <label className="form-label">Antall plasser<RequiredAsterisk/></label>
                        <input type="number" min={1} className="form-control" id="registration-capacity-input"/>
                        <div className={"invalid-feedback"}/>
                    </div>
                    {/*Price */}
                    <div id="registration-price" className="mb-3">
                        <label className="form-label">Pris</label>
                        <input className="form-control" id="registration-price-input"/>
                        <div className={"invalid-feedback"}/>
                    </div>
                    {/*Reg deadline date */}
                    <div id="registration-deadline" className="mb-3">
                        <label htmlFor="start-date" className="form-label">Påmeldingsfrist<RequiredAsterisk/></label>
                        <DateTimePicker
                            id={"registration-deadline-input"}
                            selected={this.state.deadline_datetime}
                            onChange={date => this.setState({deadline_datetime: date})}
                        />
                        <div id="registration-deadline-feedback" className={"invalid-feedback"}/>
                    </div>
                    {/*Date */}
                    <div id="starting-time" className="mb-3">
                        <label htmlFor="start-date" className="form-label">Starttidspunkt<RequiredAsterisk/></label>
                        <DateTimePicker
                            id={"starting-time-input"}
                            selected={this.state.start_datetime}
                            onChange={date => this.setState({start_datetime: date})}
                        />
                        <div id="starting-time-feedback" className={"invalid-feedback"}/>
                    </div>
                    {/*Location */}
                    <div id="location" className="mb-3">
                        <label htmlFor="activity-location" className="form-label">Sted<RequiredAsterisk/></label>
                        <input id="activity-location-input" type="text" className="form-control"
                               placeholder="Gløshaugen"/>
                        <div className={"invalid-feedback"}/>
                    </div>
                </div>
            </FormWithValidation>
        );
    }
}

export default withRouter(ActivityForm);
