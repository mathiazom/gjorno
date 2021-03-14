import React from 'react';

export default class DetailedActivity extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <h2 className="text-success">{this.props.activity.title}</h2>
                <p className={"fw-bold"}>{this.props.activity.ingress}</p>
                <section>
                    <p>{this.props.activity.description}</p>
                </section>
            </div>
        );
    }
}