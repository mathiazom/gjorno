import React from 'react';
import MultiSelect from "react-multi-select-component";

/**
 * Input element for selection of multiple activity categories
 */
export default class CategorySelect extends React.Component{

    render() {

        return (
            <div id={this.props.id}>
                <MultiSelect
                    className={this.props.className}
                    options={this.props.categories}
                    value={this.props.selected_categories}
                    onChange={this.props.onChange}
                    hasSelectAll={false}
                    focusSearchOnOpen={false}
                    overrideStrings={{
                        "selectSomeItems": "Velg",
                        "allItemsAreSelected": "Alle kategorier",
                        "search": "Søk"
                    }}
                />
            </div>
        )

    }

}