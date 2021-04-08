import React from 'react';

/**
 * Generic page component for standardizing styling accross multiple pages
 */
export default class FormPage extends React.Component {

    render() {

        return (
            <div className="container-fluid mb-5 mt-4 mt-md-5 mx-auto px-3" style={{maxWidth: "800px"}}>
                {this.props.children}
            </div>
        )

    }

}