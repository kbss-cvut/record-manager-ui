import React from "react";
import DatePicker from "react-datepicker";
import {Button, Col, Form, Row} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {useI18n} from "../../../hooks/useI18n";
import {SortDirection} from "../../../constants/DefaultConstants";
import {FaCheck} from "react-icons/fa";

function toIsoDate(date) {
    // Work around timezones - https://github.com/Hacker0x01/react-datepicker/issues/1787
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().substring(0, 10);
}

const DateIntervalFilter = ({minDate, maxDate, sort, onChange}) => {
    const {i18n} = useI18n();
    const startDate = minDate ? Date.parse(minDate) : undefined;
    const endDate = maxDate ? Date.parse(maxDate) : new Date();
    return <Form className="mt-1">
        <Form.Group as={Row} controlId="date-interval-filter-from">
            <Form.Label column={true} xs={4}>{i18n("filters.date.from")}</Form.Label>
            <Col xs={8}>
                <DatePicker selected={startDate} selectsStart={true} startDate={startDate} endDate={endDate}
                            className="filter-datetimepicker float-right form-control"
                            dateFormat="dd-MM-yyyy" onChange={v => onChange({minDate: toIsoDate(v)}, {})}/>
            </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="date-interval-filter-to" className="mb-0">
            <Form.Label column={true} xs={4}>{i18n("filters.date.to")}</Form.Label>
            <Col xs={8}>
                <DatePicker selected={endDate} selectsEnd={true} startDate={startDate} endDate={endDate}
                            maxDate={new Date()} className="filter-datetimepicker float-right form-control"
                            dateFormat="dd-MM-yyyy" onChange={v => onChange({maxDate: toIsoDate(v)}, {})}/>
            </Col>
        </Form.Group>
        <hr/>
        <Row>
            <Col>
                <Button size="sm" variant="link" active={sort === SortDirection.ASC}
                        onClick={() => onChange({}, {date: SortDirection.ASC})}>
                    {i18n("sort.asc")}
                    {sort === SortDirection.ASC && <FaCheck className="ml-1"/>}
                </Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Button size="sm" variant="link" active={sort === SortDirection.ASC}
                        onClick={() => onChange({}, {date: SortDirection.DESC})}>
                    {i18n("sort.desc")}
                    {sort === SortDirection.DESC && <FaCheck className="ml-1"/>}
                </Button>
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col>
                <div className="float-right">
                    <Button size="sm" disabled={minDate === undefined && maxDate === undefined}
                            onClick={() => onChange({
                                minDate: undefined,
                                maxDate: undefined
                            }, {date: SortDirection.DESC})}>{i18n("filters.reset")}</Button>
                </div>
            </Col>
        </Row>
    </Form>;
};

export default DateIntervalFilter;
