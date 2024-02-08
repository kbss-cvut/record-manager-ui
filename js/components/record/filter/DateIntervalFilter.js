import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function toIsoDate(date) {
    return date.toISOString().substring(0, 10);
}

const DateIntervalFilter = ({minDate, maxDate, onMinDateChange, onMaxDateChange}) => {
    const startDate = minDate ? Date.parse(minDate) : undefined;
    const endDate = maxDate ? Date.parse(maxDate) : new Date();
    return <div className="d-flex justify-content-between">
        <DatePicker selected={startDate} selectsStart={true} startDate={startDate} endDate={endDate} className="filter-datetimepicker"
                    dateFormat="dd-MM-yyyy" onChange={v => onMinDateChange(toIsoDate(v))}/>
        <DatePicker selected={endDate} selectsEnd={true} startDate={startDate} endDate={endDate} maxDate={new Date()} className="filter-datetimepicker"
                    dateFormat="dd-MM-yyyy" onChange={v => onMaxDateChange(toIsoDate(v))}/>
    </div>;
}

export default DateIntervalFilter;
