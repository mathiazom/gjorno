import React from 'react';

/**
 * Main text for an activity
 */
export default class ActivityText extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <h1 className="text-success">{this.props.activity?.title}</h1>
                <h4 className={"fw-bold mt-3 mb-4"}>{this.props.activity?.ingress}</h4>
                <section>
                    <p className={"fs-5"} style={{whiteSpace: "pre-wrap"}}>{this.props.activity?.description}</p>
                </section>
            </div>
        );
    }

}
