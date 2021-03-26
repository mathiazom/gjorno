import React from 'react';
import {withRouter} from "react-router-dom";

class FormWithValidation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <>
                <form className={"row needs-validation"} noValidate>
                    {this.props.children}
                </form>
                {this.props.noButtons ||
                    <div className="mt-5 row">
                        <div className={"d-none d-md-block col-4 pe-4"}>
                            <button className="btn btn-outline-secondary w-100"
                                    onClick={this.props.history.goBack}>Avbryt
                            </button>
                        </div>
                        <div className={"col"}>
                            <button className="btn btn-success w-100" onClick={this.props.submit}>{this.props.submitText}</button>
                        </div>
                    </div>
                }
            </>
        )

    }

}
export default withRouter(FormWithValidation);