import React from 'react';

export default class DetailedActivity extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <h1 className="text-success">{this.props.activity.title}</h1>
                <h3 className={"fw-bold"}>{this.props.activity.ingress}</h3>
                <section>
                    <p className="text-break">{this.props.activity.description}</p>
                </section>
            </div>
        );
    }
}