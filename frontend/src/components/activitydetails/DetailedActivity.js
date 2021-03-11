import React from 'react';

export default class DetailedActivity extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <p>{this.props.activity.title}</p>
        );
    }
}