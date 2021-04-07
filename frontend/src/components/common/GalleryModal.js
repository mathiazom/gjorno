import React from 'react';
import './GalleryModal.css';

const GalleryRow = (props) => {
    return props.images.map(image => {
            return (
                <div className={"col-12 col-md-6 p-1"} key={image.id}>
                    <img src={image.image} className={"img-fluid rounded gallery-modal-image"} title={image.title}
                         alt={image.title} onClick={props.onClick.bind(this,image.id)}/>
                </div>
            );
        }
    )
}

const GALLERY_COLUMNS = 2;

export default class GalleryModal extends React.Component {

    constructor(props) {
        super(props);
        this.onImageSelected = this.onImageSelected.bind(this);
    }

    partitionList(l, n) {
        let p = [];
        for (let i = 0; i < l.length; i += n) {
            p[p.length] = l.slice(i, i + n);
        }
        return p;
    }

    onImageSelected(id){
        this.props.onImageSelected(id);
        document.getElementById("gallery-close-button").click();
    }

    renderGalleryImages() {
        const rows = this.partitionList(this.props.images, GALLERY_COLUMNS);
        return rows.map((row) => (
            <div className={"row mb-3 d-flex align-items-center"} key={row[0].id}>
                <GalleryRow images={row} onClick={this.onImageSelected} />
            </div>
        ));
    }

    render() {

        return (
            <div className="modal fade" id={this.props.id} tabIndex="-1" aria-labelledby="galleryModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable" style={{maxWidth: "800px"}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="galleryModalLabel">Bildegalleri</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                        </div>
                        <div className="modal-body ms-3 me-3">
                            {this.renderGalleryImages()}
                        </div>
                        <div className="modal-footer">
                            <button id="gallery-close-button" type="button" className="btn btn-secondary" data-bs-dismiss="modal">Lukk</button>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}