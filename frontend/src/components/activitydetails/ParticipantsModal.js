import React from 'react';
import {formatPhoneNumber} from "../common/Utils";

export default class ParticipantsModal extends React.Component {

    constructor(props) {
        super(props);
    }

    renderParticipants() {
        return this.props.participants.map((participant) => (
            <div key={participant.id} className={"d-flex mb-4"}>
                <img className={"rounded-img avatar align-self-center"} src={participant.avatar || "/images/profil.png"}/>
                <div className={"flex-column ms-4 mt-3 mb-3 align-self-center"}>
                    <p className={"m-0"}>{participant.username}</p>
                    {participant.email &&
                    <a href={`mailto:${participant.email}`} className={"m-0 fw-light text-success no-decoration"}>{participant.email}</a>
                        || participant.phone_number &&
                    <a href={`tel:${participant.phone_number}`} className={"m-0 fw-light text-success no-decoration"}>{formatPhoneNumber(participant.phone_number)}</a>
                    }
                </div>
            </div>
        ))
    }

    render() {

        return (
            <div className="modal fade" id={this.props.id} tabIndex="-1" aria-labelledby="participantsModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="participantsModalLabel">Påmeldte <span className={"ms-1 me-1"}>·</span><span className={"fw-light"}> {this.props.participants.length}</span></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                        </div>
                        <div className="modal-body ms-3 me-3">
                            {this.props.participants.length > 0 &&
                                this.renderParticipants()
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Lukk</button>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}