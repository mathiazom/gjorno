import React from 'react';
import GalleryModal from "./GalleryModal";
import axios from "axios";

export default class ImageUpload extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            gallery_images: [],
            show_preview: true
        };
        this.onGalleryImageSelected = this.onGalleryImageSelected.bind(this);
    }

    /**
     * Retrieve all available categories
     */
    componentDidMount() {

        if(this.props.withGallery){
            this.retrieveGalleryImages();
        }

        this.attachImageInputListener();

        this.attachImageRemoveButtonListener();


    }

    /**
     * Check if image has been passed from parent, if so load it
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        if (prevProps.image == null && this.props.image != null) {
            this.onImageUploaded(this.props.image);
        }
    }

    /**
     * Retrieve all available categories
     */
    retrieveGalleryImages() {
        axios
            .get('https://api.gjorno.site/api/images/')
            .then(res => {
                this.setState({gallery_images: res.data});
            })
            .catch(error => {
                console.log(error.response);
            })
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
                this.onImageUploaded(e.target.result);
                const imagePreview = document.getElementById("image-preview");
                imagePreview.addEventListener("load",() => {
                    // Image was displayed, so probably valid
                    this.props.onImageChanged({"image": image});
                },{once: true});
                imagePreview.addEventListener("error",() => {
                    // Image display failed, so probably invalid
                    this.props.onImageChanged({"image": null});
                },{once: true});
            }
            imageReader.readAsDataURL(image);
        }
    }

    /**
     * Handle preview and image buttons when an image has been selected (upload or gallery)
     * @param src: image location (url)
     */
    onImageUploaded(src) {

        // Load image
        document.getElementById("image-preview").src = src;

        // Show preview with buttons
        document.getElementById("image-preview-container").classList.add("show");
        this.setState({show_preview: true});
        document.getElementById("image-preview-toggle").style.display = "inline-block";
        document.getElementById("image-remove").style.display = "inline-block";

    }

    /**
     * Set image from gallery
     * @param id: id of selected image
     */
    onGalleryImageSelected(id) {

        // Get source url of gallery image with given id
        const src = this.state.gallery_images.find((image) => image.id === id).image;

        // Reset image upload field
        document.getElementById('image-upload').value = "";
        this.onImageUploaded(src);

        // Notify parent
        this.props.onImageChanged({"gallery_image": id});

    }

    /**
     * Define behaviour of remove button
     */
    attachImageRemoveButtonListener() {

        const imageUpload = document.getElementById('image-upload');
        const imagePreviewCont = document.getElementById("image-preview-container");
        const imagePreview = document.getElementById("image-preview");
        const imagePreviewBtn = document.getElementById("image-preview-toggle");
        const imageRemoveBtn = document.getElementById("image-remove");

        imageRemoveBtn.onclick = () => {

            // Clear upload input
            imageUpload.value = "";

            // Hide image preview
            imagePreviewCont.classList.remove("show");
            this.setState({show_preview: false});
            imagePreview.src = "";
            imagePreviewBtn.style.display = "none";
            imageRemoveBtn.style.display = "none";

            // Notify parent
            this.props.onImageChanged({"image": new File([], '')});

        }

    }

    render() {

        return (
            <div id={this.props.id}>
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
                            onClick={() => this.setState({show_preview: !this.state.show_preview})}>
                        {this.state.show_preview === true ? "Skjul forhåndsvisning" : "Vis forhåndsvisning"}
                    </button>
                    <button id={"image-remove"} type="button" className="btn btn-outline-danger"
                            style={{display: "none"}}>Fjern bilde
                    </button>
                </p>
                {this.props.withGallery &&
                    <>
                        <button type="button" className="btn btn-outline-success" data-bs-toggle="modal"
                                data-bs-target="#galleryModal">
                            Velg fra bildegalleri
                        </button>
                        <GalleryModal id={"galleryModal"} images={this.state.gallery_images}
                                      onImageSelected={this.onGalleryImageSelected}/>
                    </>
                }
            </div>
        )

    }

}