import React from 'react';
import {updatePageTitle} from "../common/Utils";

export default class ShowAll extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        updatePageTitle(this.props.title);
        this.props.onMount();
    }

    render() {
        return (
            <div className="container-fluid w-75 mt-5">
                <h2>{this.props.title}</h2>
                <div>
                    {this.props.activities.map(this.props.renderItem)}
                </div>
            </div>
        );
    }
}
