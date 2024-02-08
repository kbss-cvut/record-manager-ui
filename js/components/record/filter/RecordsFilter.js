import React from "react";
import {useI18n} from "../../../hooks/useI18n";
import PhaseFilter from "./PhaseFilter";
import {Button, Col, Form, OverlayTrigger, Popover, Row} from "react-bootstrap";
import DateIntervalFilter from "./DateIntervalFilter";
import {IfGranted} from "react-authorization";
import {ROLE} from "../../../constants/DefaultConstants";
import {useSelector} from "react-redux";
import InstitutionFilter from "./InstitutionFilter";

const RecordsFilter = ({filters, onChange}) => {
    const user = useSelector(state => state.auth.user);
    const {i18n} = useI18n();
    const filtersPopover = <Popover id="record-filters">
        <Popover.Title as="h4">{i18n("filters")}</Popover.Title>
        <Popover.Content>
            <Form className="container">
                <Form.Group as={Row} controlId="records-filters-status">
                    <Form.Label column={true} xs={4}>{i18n("records.completion-status")}</Form.Label>
                    <Col xs={8}><PhaseFilter value={filters.phase} onChange={v => onChange({phase: v})}/></Col>
                </Form.Group>
                <Form.Group as={Row} controlId="records-filters-lastModified">
                    <Form.Label column={true} xs={4}>{i18n("records.last-modified")}</Form.Label>
                    <Col xs={8}>
                        <DateIntervalFilter minDate={filters.minDate} maxDate={filters.maxDate}
                                            onMinDateChange={v => onChange({minDate: v})}
                                            onMaxDateChange={v => onChange({maxDate: v})}/>
                    </Col>
                </Form.Group>
                <IfGranted expected={ROLE.ADMIN} actual={user.role}>
                    <Form.Group as={Row} controlId="records-filters-institution">
                        <Form.Label column={true} xs={4}>{i18n("institution.panel-title")}</Form.Label>
                        <Col xs={8}>
                            <InstitutionFilter value={filters.institution}
                                               onChange={v => onChange({institution: v})}/>
                        </Col>
                    </Form.Group>
                </IfGranted>
            </Form>
        </Popover.Content>
    </Popover>;
    return <>
        <div className="mb-3">
            <OverlayTrigger trigger="click" placement="right" overlay={filtersPopover} rootClose={true}>
                <Button id="record-filters-trigger" variant="primary" size="sm"
                        className="action-button">{i18n("filters")}</Button>
            </OverlayTrigger>
        </div>
    </>;
};

export default RecordsFilter;
