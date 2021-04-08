import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {nb} from 'date-fns/esm/locale'

/**
 * Date picker for both date and time input
 */
export default class DateTimePicker extends React.Component{

    render(){ 

        return (
            <DatePicker
                id={this.props.id}
                className={"form-control"}
                showTimeSelect
                selected={this.props.selected}
                onChange={this.props.onChange}
                dateFormat="EEEE do MMM yyyy 'kl.' HH:mm"
                timeCaption={"Kl.slett"}
                locale={nb}
                timeIntervals={15}
                minDate={new Date()}
                showDisabledMonthNavigation
                filterTime={this.isInFuture}
            />
        )

    }

}